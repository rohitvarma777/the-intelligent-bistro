# The Intelligent Bistro

A full-stack French bistro restaurant ordering app built with **Expo 55** (React Native) and an **Express** backend powered by an AI concierge named **Henri** — running on Llama 3.3 via Groq.

---

## Screenshots

| Menu | Cart | AI Chef |
|------|------|---------|
| Browse dishes by category with a food-photo hero and animated card list | Add/remove items, see subtotal, tax, and place your order | Chat naturally with Henri who understands your order and updates your cart |

---

## Features

- **La Carte** — Full menu with category filters, skeleton loading, and add-to-cart stepper
- **Panier** — Cart with quantity controls, item removal, tax calculation, and order placement
- **Le Chef** — AI chat powered by Llama 3.3 (via Groq) that understands natural language and modifies your cart in real-time
- Animated splash screen, hero section with dark gradient overlay
- Cross-platform icons (SF Symbols on iOS, Ionicons on web/Android)
- Persistent cart state via Zustand

---

## Tech Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | [Expo 55](https://expo.dev) / React Native 0.83.6 |
| Routing | [expo-router](https://expo.github.io/router) (file-based tabs) |
| Animations | [react-native-reanimated 4.2.1](https://docs.swmansion.com/react-native-reanimated/) |
| State | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| Icons | expo-symbols (iOS) + @expo/vector-icons Ionicons (web/Android) |
| Styling | StyleSheet.create (inline React Native styles) |

### Backend
| Layer | Technology |
|-------|-----------|
| Server | [Express 4](https://expressjs.com/) on Node.js |
| AI Model | Llama 3.3 70B via [Groq API](https://console.groq.com) |
| Protocol | REST — `POST /api/chat` returns `{ message, actions[] }` |

---

## Project Structure

```
the-intelligent-bistro/
├── frontend/                  # Expo app
│   ├── src/
│   │   ├── app/
│   │   │   ├── _layout.tsx    # Tab navigator (La Carte / Panier / Le Chef)
│   │   │   ├── index.tsx      # Menu screen
│   │   │   ├── cart.tsx       # Cart screen
│   │   │   └── chat.tsx       # AI chat screen
│   │   ├── store/
│   │   │   ├── cart.ts        # Zustand cart store
│   │   │   └── menu.ts        # Menu data (items + categories)
│   │   └── components/
│   │       └── animated-icon.tsx  # Splash screen overlay
│   ├── assets/                # Images and icons
│   ├── app.json               # Expo config
│   └── package.json
│
├── backend/                   # Express API
│   ├── server.js              # Single-file Express server + Groq AI chat
│   ├── .env.example           # Environment variable template
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- A free [Groq API key](https://console.groq.com) (no credit card required)

---

### 1. Clone the repo

```bash
git clone https://github.com/rohitvarma777/the-intelligent-bistro.git
cd the-intelligent-bistro
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Open `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

> Get a free key at [console.groq.com](https://console.groq.com) → API Keys → Create API Key. No credit card needed — 14,400 requests/day free.

Start the server:

```bash
npm start          # production
npm run dev        # watch mode (auto-restarts on file changes)
```

The backend runs on `http://localhost:3001`.

---

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

Start the Expo dev server:

```bash
npx expo start
```

Then open on your preferred platform:

| Platform | Command / Action |
|----------|-----------------|
| iOS Simulator | Press `i` in the terminal |
| Android Emulator | Press `a` in the terminal |
| Web browser | Press `w` in the terminal |
| Physical device | Scan the QR code with the [Expo Go](https://expo.dev/go) app |

---

## API Reference

### `POST /api/chat`

Send a natural language message and receive an AI response with optional cart actions.

**Request body:**
```json
{
  "message": "I'd like two croissants please",
  "cart": [
    { "id": "1", "name": "Croissant", "price": 4.50, "quantity": 1 }
  ],
  "menu": [
    { "id": "1", "name": "Croissant", "category": "Bakery", "price": 4.50, "desc": "Buttery flaky croissant" }
  ]
}
```

**Response:**
```json
{
  "message": "Bien sûr! Two croissants coming right up, monsieur!",
  "actions": [
    { "action": "add", "itemId": "1", "quantity": 2 }
  ]
}
```

**Supported actions:**

| Action | Fields | Description |
|--------|--------|-------------|
| `add` | `itemId`, `quantity` | Add item(s) to cart |
| `remove` | `itemId` | Remove item from cart |
| `update` | `itemId`, `quantity` | Set a new quantity |
| `clear` | — | Empty the entire cart |

### `GET /health`

Returns `{ "status": "ok" }` — use this to confirm the server is running.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Your Groq API key from [console.groq.com](https://console.groq.com) |
| `PORT` | No | Port to run the server on (default: `3001`) |

### Frontend

The frontend auto-detects the backend URL based on platform:

| Platform | Default URL |
|----------|-------------|
| iOS Simulator / Web | `http://localhost:3001` |
| Android Emulator | `http://10.0.2.2:3001` |
| Custom | Set `EXPO_PUBLIC_API_URL` in `frontend/.env` |

---

## License

MIT
