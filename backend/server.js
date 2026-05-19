import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// ─── System prompt builder ────────────────────────────────────────────────────
function buildSystemPrompt(menu, cart) {
  const menuText = menu.length
    ? menu
        .map((item) => `- ${item.name} (ID: ${item.id}) | ${item.category} | $${item.price} | ${item.desc}`)
        .join("\n")
    : "Menu not available.";

  const cartText = cart.length
    ? cart
        .map((item) => `- ${item.name} (ID: ${item.id}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`)
        .join("\n")
    : "Cart is empty.";

  return `You are Henri, the charming French concierge AI for Bistro Intelligent — a fine Parisian bistro. You are warm, witty, and speak with a light French flair. You help guests browse the menu and manage their cart.

MENU:
${menuText}

CURRENT CART:
${cartText}

You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) in exactly this format:
{"message":"<your friendly response in 1-3 sentences>","actions":[]}

The "actions" array can contain zero or more of these operations:
- Add item:    {"action":"add","itemId":"<id>","quantity":<number>}
- Remove item: {"action":"remove","itemId":"<id>"}
- Update qty:  {"action":"update","itemId":"<id>","quantity":<number>}
- Clear cart:  {"action":"clear"}

Rules:
- When the guest asks to add an item, include an "add" action with the correct itemId from the menu above.
- When they want to remove or change quantity, use "remove" or "update".
- When they want to start over or clear everything, use "clear".
- If you cannot find a matching item, apologize and list what is on the menu.
- Keep your message charming and in character as Henri — occasionally use a French phrase.
- NEVER include markdown, code blocks, or any text outside the JSON object.`;
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message, cart = [], menu = [] } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: buildSystemPrompt(menu, cart) },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", response.status, err);
      return res.status(500).json({
        message: "Mon dieu! Something went wrong. Please try again.",
        actions: [],
      });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    if (!parsed?.message) {
      return res.json({ message: raw || "Pardonnez-moi, could you rephrase that?", actions: [] });
    }

    res.json({ message: parsed.message, actions: Array.isArray(parsed.actions) ? parsed.actions : [] });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      message: "Mon dieu! Something went wrong. Please try again.",
      actions: [],
    });
  }
});

app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Intelligent Bistro backend running on port ${PORT}`);
});
