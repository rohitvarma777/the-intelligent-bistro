import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StatusBar, StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cart";
import { MENU, CATEGORIES, MenuItem, Category } from "@/store/menu";

const HERO = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=95&auto=format&fit=crop";

const BG    = "#F7F0E3", CARD  = "#FFFCF5", BORDER = "#D8C8A8";
const WINE  = "#7B2D40", BRASS = "#C4922A", TEXT   = "#1A1208";
const MUTED = "#7A6848", SKEL  = "#EAD9BC", WHITE  = "#FFFDF8";

// ── Skeleton card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  const pulse = useSharedValue(0.38);
  useEffect(() => { pulse.value = withRepeat(withTiming(0.82, { duration: 900 }), -1, true); }, []);
  const anim = useAnimatedStyle(() => ({ opacity: pulse.value }));
  return (
    <Animated.View style={[S.card, S.skelCard, anim]}>
      <View style={S.cardLeft}>
        <View style={S.skelLine1} />
        <View style={S.skelLine2} />
        <View style={S.skelLine3} />
        <View style={S.skelLine4} />
      </View>
      <View style={S.skelImg} />
    </Animated.View>
  );
}

// ── Stepper ────────────────────────────────────────────────────────────────────
function AddButton({ item }: { item: MenuItem }) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.id === item.id);
  const qty   = cartItem?.quantity ?? 0;
  const scale = useSharedValue(1);
  const bounce = () => {
    scale.value = withSpring(0.86, { damping: 5, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 6 });
    });
  };
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[S.stepper, anim, qty > 0 && S.stepperActive]}>
      <TouchableOpacity
        onPress={() => { if (qty > 0) updateQuantity(item.id, qty - 1); }}
        style={S.stepBtn} activeOpacity={qty === 0 ? 1 : 0.65}
      >
        <Text style={[S.stepMinus, qty === 0 && S.stepDisabled]}>−</Text>
      </TouchableOpacity>
      <Text style={[S.stepCount, qty > 0 && S.stepCountActive]}>{qty}</Text>
      <TouchableOpacity
        onPress={() => { bounce(); qty === 0 ? addItem(item) : updateQuantity(item.id, qty + 1); }}
        style={S.stepBtn} activeOpacity={0.65}
      >
        <Text style={S.stepPlus}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Menu card ──────────────────────────────────────────────────────────────────
function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const opacity = useSharedValue(0), ty = useSharedValue(16);
  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 360 });
      ty.value      = withSpring(0, { damping: 14, stiffness: 100 });
    }, index * 60);
    return () => clearTimeout(t);
  }, []);
  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));
  return (
    <Animated.View style={[S.card, anim]}>
      <View style={S.cardLeft}>
        <Text style={S.cardCat}>{item.category}</Text>
        <Text style={S.cardName}>{item.name}</Text>
        <Text style={S.cardDesc} numberOfLines={2}>{item.desc}</Text>
        <View style={S.cardFooter}>
          <Text style={S.cardPrice}>${item.price}</Text>
          <AddButton item={item} />
        </View>
      </View>
      <Image source={{ uri: item.image }} style={S.cardImg} resizeMode="cover" />
    </Animated.View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function MenuScreen() {
  const [active, setActive] = useState<Category>("All");
  const [loaded, setLoaded] = useState(false);
  const insets     = useSafeAreaInsets();
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1100);
    return () => clearTimeout(t);
  }, []);

  const filtered = active === "All" ? MENU : MENU.filter((m) => m.category === active);

  return (
    <View style={S.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Hero ── */}
        <View style={S.hero}>
          <Image source={{ uri: HERO }} style={S.heroImg} resizeMode="cover" />

          {/* Subtle overall tint */}
          <View style={S.heroTint} />

          {/* Dark gradient at bottom so text is readable */}
          <View style={S.heroGrad3} />
          <View style={S.heroGrad2} />
          <View style={S.heroGrad1} />

          {/* Bag button */}
          <View style={[S.bagPos, { top: insets.top + 14 }]}>
            <TouchableOpacity activeOpacity={0.82} style={S.bagBtn}>
              <Text style={{ fontSize: 19 }}>🛍️</Text>
              {totalItems > 0 && (
                <View style={S.bagBadge}>
                  <Text style={S.bagBadgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Hero copy — white on dark gradient */}
          <View style={S.heroCopy}>
            <View style={S.heroBadgeRow}>
              <View style={S.heroBadge}>
                <Text style={S.heroBadgeText}>★  4.9</Text>
              </View>
              <View style={[S.heroBadge, S.heroBadgeGold]}>
                <Text style={[S.heroBadgeText, { color: BRASS }]}>Ouvert</Text>
              </View>
            </View>
            <Text style={S.heroEyebrow}>— PARIS, FRANCE  ·  EST. 1952 —</Text>
            <Text style={S.heroTitle}>Bistro{"\n"}Intelligent</Text>
            <Text style={S.heroSub}>Cuisine Française Authentique</Text>
          </View>
        </View>

        {/* ── Category pills ── */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={S.pillScroll} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {CATEGORIES.map((cat) => {
            const on = cat === active;
            return (
              <TouchableOpacity
                key={cat} onPress={() => setActive(cat)}
                activeOpacity={0.72} style={[S.pill, on && S.pillOn]}
              >
                <Text style={[S.pillText, on && S.pillTextOn]}>
                  {cat === "All" ? "Tout" : cat.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Section header ── */}
        <View style={S.sectionRow}>
          <View style={S.sectionLine} />
          <Text style={S.sectionLabel}>
            {loaded ? `${filtered.length} plats` : "Chargement…"}
          </Text>
          <View style={S.sectionLine} />
        </View>

        {/* ── Menu list ── */}
        <View style={S.list}>
          {!loaded
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((item, i) => <MenuCard key={item.id} item={item} index={i} />)}
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },

  hero:      { height: 400, justifyContent: "flex-end" },
  heroImg:   { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  heroTint:  { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(8,2,0,0.22)" },
  heroGrad1: { position: "absolute", bottom: 0,   left: 0, right: 0, height: 210, backgroundColor: "rgba(8,2,0,0.80)" },
  heroGrad2: { position: "absolute", bottom: 150, left: 0, right: 0, height: 100, backgroundColor: "rgba(8,2,0,0.42)" },
  heroGrad3: { position: "absolute", bottom: 220, left: 0, right: 0, height: 80,  backgroundColor: "rgba(8,2,0,0.16)" },

  bagPos: { position: "absolute", right: 20 },
  bagBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: "rgba(255,252,245,0.15)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center", justifyContent: "center",
  },
  bagBadge: {
    position: "absolute", top: -4, right: -4,
    backgroundColor: WINE, width: 20, height: 20, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  bagBadgeText: { color: WHITE, fontSize: 10, fontWeight: "800" },

  heroCopy:     { paddingHorizontal: 22, paddingBottom: 28 },
  heroBadgeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  heroBadge: {
    paddingHorizontal: 11, paddingVertical: 5, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.22)",
  },
  heroBadgeGold: { backgroundColor: "rgba(196,146,42,0.22)", borderColor: "rgba(196,146,42,0.35)" },
  heroBadgeText: { color: WHITE, fontSize: 11, fontWeight: "700" },
  heroEyebrow:   { color: BRASS, fontSize: 9, fontWeight: "700", letterSpacing: 2.5, marginBottom: 8 },
  heroTitle:     { color: WHITE, fontSize: 42, fontWeight: "900", lineHeight: 46, marginBottom: 8, fontStyle: "italic" },
  heroSub:       { color: "rgba(255,255,255,0.68)", fontSize: 12, fontStyle: "italic", letterSpacing: 0.4 },

  pillScroll: { marginTop: 22, marginBottom: 4 },
  pill:       { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 4, borderWidth: 1, borderColor: BORDER, backgroundColor: CARD },
  pillOn:     { backgroundColor: WINE, borderColor: WINE },
  pillText:   { color: MUTED, fontSize: 10, fontWeight: "700", letterSpacing: 1.2 },
  pillTextOn: { color: WHITE },

  sectionRow:   { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginTop: 20, marginBottom: 14, gap: 10 },
  sectionLine:  { flex: 1, height: 1, backgroundColor: BORDER },
  sectionLabel: { color: MUTED, fontSize: 11, fontWeight: "600", letterSpacing: 0.8 },

  list: { paddingHorizontal: 16, gap: 10 },

  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: CARD, borderRadius: 10,
    paddingVertical: 14, paddingHorizontal: 14, gap: 14,
    shadowColor: "#3A1A08", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09, shadowRadius: 7, elevation: 2,
  },
  cardLeft:   { flex: 1 },
  cardCat:    { color: WINE, fontSize: 9, fontWeight: "700", letterSpacing: 1.5, marginBottom: 4, textTransform: "uppercase" },
  cardName:   { color: TEXT,  fontSize: 16, fontWeight: "700", marginBottom: 5, lineHeight: 20 },
  cardDesc:   { color: MUTED, fontSize: 12, lineHeight: 17, fontStyle: "italic", marginBottom: 14 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardPrice:  { color: BRASS, fontSize: 18, fontWeight: "800" },
  cardImg:    { width: 94, height: 94, borderRadius: 8, backgroundColor: SKEL },

  stepper:       { flexDirection: "row", alignItems: "center", borderRadius: 20, borderWidth: 1.5, borderColor: BORDER, backgroundColor: BG, height: 36, overflow: "hidden" },
  stepperActive: { borderColor: WINE, backgroundColor: CARD },
  stepBtn:       { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  stepMinus:     { color: WINE, fontSize: 18, fontWeight: "700" },
  stepPlus:      { color: WINE, fontSize: 18, fontWeight: "700" },
  stepDisabled:  { color: BORDER },
  stepCount:     { color: MUTED, fontWeight: "700", width: 26, textAlign: "center", fontSize: 14 },
  stepCountActive: { color: TEXT },

  skelCard:  { opacity: 0.55, backgroundColor: SKEL },
  skelLine1: { height: 10, width: "38%", backgroundColor: "#C8B490", borderRadius: 4, marginBottom: 10 },
  skelLine2: { height: 16, width: "72%", backgroundColor: "#C8B490", borderRadius: 4, marginBottom: 10 },
  skelLine3: { height: 11, width: "90%", backgroundColor: "#D4C0A0", borderRadius: 4, marginBottom: 6 },
  skelLine4: { height: 11, width: "55%", backgroundColor: "#D4C0A0", borderRadius: 4 },
  skelImg:   { width: 94,  height: 94,  borderRadius: 8, backgroundColor: "#C8B490" },
});
