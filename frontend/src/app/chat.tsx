import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ListRenderItem,
  StyleSheet,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import axios from "axios";
import { useCartStore } from "@/store/cart";
import { MENU } from "@/store/menu";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type CartAction =
  | { action: "add"; itemId: string; quantity: number }
  | { action: "remove"; itemId: string }
  | { action: "update"; itemId: string; quantity: number }
  | { action: "clear" };

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://localhost:3001");

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    role: "assistant",
    content:
      "Bonsoir ! 🎩 Je suis Henri, votre concierge personnel. I can recommend dishes from our carte, add items to your panier, or help you plan the perfect repas. Comment puis-je vous aider ce soir ?",
  },
];

const QUICK_PROMPTS = [
  { emoji: "📖", text: "What's on the menu?" },
  { emoji: "🍝", text: "Add a Carbonara" },
  { emoji: "🧺", text: "What's in my cart?" },
  { emoji: "✨", text: "Surprise me!" },
  { emoji: "🍷", text: "Wine pairing?" },
  { emoji: "🗑️", text: "Clear my order" },
];

// ─── Mic pulse ring ────────────────────────────────────────────────────────────
function MicPulse() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.6, { duration: 900 }), -1, false);
    opacity.value = withRepeat(withTiming(0, { duration: 900 }), -1, false);
  }, []);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        { borderRadius: 22, backgroundColor: C.wine },
        anim,
      ]}
    />
  );
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);
  const recognitionRef = useRef<any>(null);

  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore();

  const applyActions = useCallback(
    (actions: CartAction[]) => {
      for (const action of actions) {
        if (action.action === "add") {
          const menuItem = MENU.find((m) => m.id === action.itemId);
          if (menuItem) addItem(menuItem, action.quantity);
        } else if (action.action === "remove") {
          removeItem(action.itemId);
        } else if (action.action === "update") {
          updateQuantity(action.itemId, action.quantity);
        } else if (action.action === "clear") {
          clearCart();
        }
      }
    },
    [addItem, removeItem, updateQuantity, clearCart]
  );

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: trimmed },
    ]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/chat`, {
        message: trimmed,
        cart: items,
        menu: MENU,
      });
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.message },
      ]);
      if (data.actions?.length > 0) applyActions(data.actions);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Pardon — je ne peux pas joindre le serveur. Please make sure the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = useCallback(() => {
    if (Platform.OS !== "web") {
      Alert.alert("Bientôt", "Voice input is available on web. Mobile support coming soon!");
      return;
    }
    const SR: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      Alert.alert("Non supporté", "Please use Chrome or Safari for voice input.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setInput((prev) => (prev.trim() ? prev + " " + t : t));
      setListening(false);
    };
    recognitionRef.current = rec;
    rec.start();
  }, [listening]);

  const renderMessage: ListRenderItem<Message> = ({ item }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.msgWrap, isUser ? styles.msgWrapUser : styles.msgWrapAI]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={{ fontSize: 16 }}>🎩</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  const showIntro = messages.length === 1 && !loading;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Decorative background ornaments */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {[
          { t: 100, l: 14, s: 48 }, { t: 220, r: 18, s: 36 },
          { t: 340, l: 30, s: 28 }, { t: 450, r: 40, s: 44 },
          { t: 560, l: 10, s: 32 }, { t: 660, r: 16, s: 40 },
        ].map((p, i) => (
          <Text
            key={i}
            style={[
              styles.bgOrnament,
              { top: p.t, left: p.l, right: (p as any).r, fontSize: p.s },
            ]}
          >
            ✦
          </Text>
        ))}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>VOTRE</Text>
            <Text style={styles.headerTitle}>Concierge</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>À votre service</Text>
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerOrnament}>✦</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Concierge intro card (visible until user sends first message) ── */}
        {showIntro && (
          <View style={styles.introCard}>
            <View style={styles.introAvatarRing}>
              <Text style={{ fontSize: 34 }}>🎩</Text>
            </View>
            <Text style={styles.introName}>Monsieur Henri</Text>
            <Text style={styles.introTitle}>Maître Concierge · Paris</Text>
            <View style={styles.introTagRow}>
              <View style={styles.introTag}>
                <Text style={styles.introTagText}>🍷 Sommelier certifié</Text>
              </View>
              <View style={styles.introTag}>
                <Text style={styles.introTagText}>🇫🇷 Cuisine française</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Messages ── */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          style={{ flex: 1, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingVertical: 12 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {/* Typing indicator */}
        {loading && (
          <View style={[styles.msgWrap, styles.msgWrapAI, { paddingHorizontal: 16 }]}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 16 }}>🎩</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleAI, { paddingVertical: 14, paddingHorizontal: 20 }]}>
              <ActivityIndicator size="small" color={C.wine} />
            </View>
          </View>
        )}

        {/* ── Quick suggestions grid ── */}
        {showIntro && (
          <View style={styles.suggestWrap}>
            <Text style={styles.suggestLabel}>Suggestions</Text>
            <View style={styles.suggestGrid}>
              {QUICK_PROMPTS.map((p) => (
                <TouchableOpacity
                  key={p.text}
                  onPress={() => send(p.text)}
                  activeOpacity={0.72}
                  style={styles.suggestCard}
                >
                  <Text style={styles.suggestEmoji}>{p.emoji}</Text>
                  <Text style={styles.suggestText}>{p.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Input bar ── */}
        <View style={styles.inputWrap}>
          {/* Mic button */}
          <View style={{ position: "relative" }}>
            {listening && <MicPulse />}
            <TouchableOpacity
              onPress={handleVoice}
              style={[styles.micBtn, listening && styles.micBtnActive]}
              activeOpacity={0.75}
            >
              <SymbolView
                name={listening ? "mic.fill" : "mic"}
                size={20}
                tintColor={listening ? C.white : C.muted}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Que désirez-vous ?"
            placeholderTextColor={C.muted}
            style={styles.input}
            multiline
            maxLength={400}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={() => send(input)}
          />

          <TouchableOpacity
            onPress={() => send(input)}
            disabled={!input.trim() || loading}
            style={[
              styles.sendBtn,
              input.trim() && !loading ? styles.sendBtnActive : styles.sendBtnInactive,
            ]}
          >
            <SymbolView
              name="arrow.up"
              size={18}
              tintColor={input.trim() && !loading ? C.white : C.muted}
              style={{ width: 18, height: 18 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const C = {
  bg:      "#F7F0E3",
  card:    "#FFFCF5",
  surface: "#F0E4D0",
  border:  "#D8C8A8",
  wine:    "#7B2D40",
  brass:   "#C4922A",
  text:    "#1A1208",
  muted:   "#7A6848",
  white:   "#FFFDF8",
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },

  bgOrnament: {
    position: "absolute",
    color: C.brass,
    opacity: 0.06,
    fontWeight: "200",
  },

  // Header
  header: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10,
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
  },
  headerEyebrow: { color: C.muted, fontSize: 10, letterSpacing: 3, fontWeight: "600" },
  headerTitle:   { color: C.text, fontSize: 30, fontWeight: "800", marginTop: 2, fontStyle: "italic" },
  statusPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 4,
    shadowColor: "#3A1A08", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  statusDot:  { width: 7, height: 7, borderRadius: 4, backgroundColor: "#4ade80" },
  statusText: { color: C.muted, fontSize: 11, fontStyle: "italic" },

  divider: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, marginBottom: 8,
  },
  dividerLine:    { flex: 1, height: 1, backgroundColor: C.border },
  dividerOrnament:{ color: C.brass, marginHorizontal: 10, fontSize: 10 },

  // Concierge intro card
  introCard: {
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: C.card, borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
    paddingVertical: 20, paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#3A1A08", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  introAvatarRing: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: C.surface, borderWidth: 2, borderColor: C.border,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
    shadowColor: C.wine, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 2,
  },
  introName:  { color: C.text, fontSize: 18, fontWeight: "800", fontStyle: "italic" },
  introTitle: { color: C.muted, fontSize: 12, marginTop: 3, fontStyle: "italic", marginBottom: 12 },
  introTagRow:{ flexDirection: "row", gap: 8 },
  introTag:   {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  introTagText: { color: C.muted, fontSize: 11, fontWeight: "600" },

  // Messages
  msgWrap:     { flexDirection: "row", alignItems: "flex-end", marginBottom: 10 },
  msgWrapUser: { justifyContent: "flex-end" },
  msgWrapAI:   { justifyContent: "flex-start" },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    alignItems: "center", justifyContent: "center",
    marginRight: 8, marginBottom: 2,
    shadowColor: "#3A1A08", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  bubble: { maxWidth: "78%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  bubbleAI: {
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderBottomLeftRadius: 4,
    shadowColor: "#3A1A08", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  bubbleUser: { backgroundColor: C.wine, borderBottomRightRadius: 4 },
  bubbleText:     { color: C.text, fontSize: 14, lineHeight: 21 },
  bubbleTextUser: { color: C.white },

  // Suggestions
  suggestWrap: { paddingHorizontal: 16, paddingBottom: 8 },
  suggestLabel: {
    color: C.muted, fontSize: 10, fontWeight: "700",
    letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase",
  },
  suggestGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestCard: {
    width: "47%", flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    shadowColor: "#3A1A08", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  suggestEmoji: { fontSize: 18 },
  suggestText: { color: C.text, fontSize: 12, fontWeight: "600", flex: 1, lineHeight: 16 },

  // Input bar
  inputWrap: {
    flexDirection: "row", alignItems: "flex-end",
    paddingHorizontal: 14, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: C.border,
    backgroundColor: C.card, gap: 8,
  },
  micBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    alignItems: "center", justifyContent: "center",
  },
  micBtnActive: { backgroundColor: C.wine, borderColor: C.wine },
  input: {
    flex: 1, backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
    color: C.text, paddingHorizontal: 14, paddingVertical: 11,
    borderRadius: 10, fontSize: 14, maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
  },
  sendBtnActive: {
    backgroundColor: C.wine,
    shadowColor: C.wine, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 6, elevation: 3,
  },
  sendBtnInactive: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
});
