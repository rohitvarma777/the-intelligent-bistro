import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/cart";

export default function CartScreen() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    Alert.alert(
      "Merci ! 🍷",
      `Votre commande de $${total.toFixed(2)} a été passée. Nous la préparons tout de suite !`,
      [{ text: "Voilà, parfait !", onPress: clearCart }]
    );
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>MON</Text>
          <Text style={styles.headerTitle}>Panier</Text>
        </View>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerOrnament}>✦</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🧺</Text>
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptySub}>
            Nos plats vous attendent…{"\n"}Parcourez la carte pour commencer.
          </Text>
          <View style={styles.emptyHint}>
            <Text style={styles.emptyHintText}>← Retournez à La Carte</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>MON</Text>
          <Text style={styles.headerTitle}>Panier</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {items.reduce((s, i) => s + i.quantity, 0)} articles
          </Text>
        </View>
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerOrnament}>✦</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Items */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {items.map((item, index) => (
          <View key={item.id}>
            <View style={styles.itemRow}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemThumb}
                resizeMode="cover"
              />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnit}>${item.price} chaque</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnMinus}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyCount}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnPlus}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
            {index < items.length - 1 && <View style={styles.itemDivider} />}
          </View>
        ))}
      </ScrollView>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxes (8%)</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryDivider, { marginTop: 8, marginBottom: 14 }]} />
        <View style={[styles.summaryRow, { marginBottom: 0 }]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          onPress={handlePlaceOrder}
          activeOpacity={0.85}
          style={styles.orderBtn}
        >
          <Text style={styles.orderBtnText}>Commander  ·  ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
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

  emptyWrap: {
    flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 20 },
  emptyTitle: {
    color: C.text, fontSize: 22, fontWeight: "800",
    marginBottom: 10, textAlign: "center", fontStyle: "italic",
  },
  emptySub: {
    color: C.muted, fontSize: 14, textAlign: "center",
    lineHeight: 22, fontStyle: "italic",
  },
  emptyHint: {
    marginTop: 28, paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 6, borderWidth: 1, borderColor: C.border,
    backgroundColor: C.card,
  },
  emptyHintText: { color: C.wine, fontSize: 13, fontWeight: "600" },

  header: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
  },
  headerEyebrow: { color: C.muted, fontSize: 10, letterSpacing: 3, fontWeight: "600" },
  headerTitle: { color: C.text, fontSize: 34, fontWeight: "800", marginTop: 2, fontStyle: "italic" },
  countBadge: {
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 4,
    shadowColor: "#3A1A08", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 4, elevation: 1,
  },
  countText: { color: C.muted, fontSize: 12, fontWeight: "600" },

  divider: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, marginBottom: 18,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerOrnament: { color: C.brass, marginHorizontal: 10, fontSize: 10 },

  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  itemThumb: { width: 72, height: 72, borderRadius: 8, backgroundColor: C.surface },
  itemName: { color: C.text, fontSize: 15, fontWeight: "700" },
  itemUnit: { color: C.muted, fontSize: 12, marginTop: 2, fontStyle: "italic" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 2 },
  qtyBtn: {
    width: 30, height: 30, backgroundColor: C.surface,
    borderRadius: 6, borderWidth: 1, borderColor: C.border,
    alignItems: "center", justifyContent: "center",
  },
  qtyBtnMinus: { color: C.muted, fontSize: 16, fontWeight: "700" },
  qtyBtnPlus:  { color: C.wine, fontSize: 16, fontWeight: "700" },
  qtyCount: { color: C.text, fontWeight: "700", width: 30, textAlign: "center", fontSize: 14 },
  removeBtn: {
    marginLeft: 8, width: 30, height: 30,
    alignItems: "center", justifyContent: "center",
    borderRadius: 6, backgroundColor: "rgba(123,45,64,0.10)",
  },
  removeBtnText: { color: C.wine, fontSize: 11, fontWeight: "700" },
  itemTotal: { color: C.brass, fontWeight: "800", fontSize: 15, marginLeft: 8 },
  itemDivider: { height: 1, backgroundColor: C.border },

  summary: {
    paddingHorizontal: 20, paddingBottom: 28, paddingTop: 8,
    backgroundColor: C.card,
    borderTopWidth: 1, borderTopColor: C.border,
    shadowColor: "#3A1A08", shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  summaryDivider: { height: 1, backgroundColor: C.border, marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { color: C.muted, fontSize: 14, fontStyle: "italic" },
  summaryValue: { color: C.text, fontSize: 14, fontWeight: "600" },
  totalLabel:   { color: C.text, fontSize: 18, fontWeight: "800", fontStyle: "italic" },
  totalValue:   { color: C.brass, fontSize: 22, fontWeight: "800" },
  orderBtn: {
    backgroundColor: C.wine, borderRadius: 8,
    paddingVertical: 17, alignItems: "center", marginTop: 18,
    shadowColor: C.wine, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  orderBtnText: { color: C.white, fontSize: 16, fontWeight: "800", letterSpacing: 0.6 },
});
