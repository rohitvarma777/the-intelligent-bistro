import "@/global.css";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import { SymbolView } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { useCartStore } from "@/store/cart";

type SymbolName = React.ComponentProps<typeof SymbolView>["name"];
type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  symbolName,
  ionName,
  focused,
  color,
}: {
  symbolName: SymbolName;
  ionName: IoniconsName;
  focused: boolean;
  color: string;
}) {
  if (Platform.OS === "ios") {
    return (
      <SymbolView
        name={symbolName}
        size={24}
        tintColor={color}
        weight={focused ? "semibold" : "regular"}
        style={{ width: 26, height: 26 }}
      />
    );
  }
  return <Ionicons name={ionName} size={24} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1E3328",
            borderTopColor: "#2D4A3C",
            borderTopWidth: 1,
            height: Platform.OS === "ios" ? 84 : 74,
            paddingBottom: Platform.OS === "ios" ? 18 : 12,
            paddingTop: 10,
          },
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "rgba(255,255,255,0.35)",
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            letterSpacing: 0.3,
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "La Carte",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon symbolName="fork.knife" ionName="restaurant" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Panier",
            tabBarBadge: itemCount > 0 ? itemCount : undefined,
            tabBarBadgeStyle: { backgroundColor: "#7B2D40", fontSize: 10 },
            tabBarIcon: ({ color, focused }) => (
              <TabIcon symbolName={focused ? "bag.fill" : "bag"} ionName={focused ? "bag" : "bag-outline"} focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Le Chef",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon symbolName="wand.and.stars" ionName={focused ? "sparkles" : "sparkles-outline"} focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>
    </ThemeProvider>
  );
}
