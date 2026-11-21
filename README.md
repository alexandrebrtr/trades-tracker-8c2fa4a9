# 📈 Trades Tracker

**Trades Tracker** is a powerful and intuitive app designed for traders who want to track, analyze, and optimize their trading performance. Perfect for forex, stocks, crypto, and more.

---

## 🚀 Key Features

- 🧾 **Trade Journal**: Log every trade with full details, screenshots, and personal notes.
- 📊 **Advanced Statistics**: Track win rate, drawdown, profit/loss ratio, capital growth, and more.
- 🗓️ **Trade Calendar**: Visualize your trading activity on a calendar view.
- 💡 **Strategy Analysis**: Analyze performance by asset or strategy used.
- 📈 **Technical Charts**: View your trades over candlestick charts with pattern annotations.
- 🧠 **Community Intelligence** *(coming soon)*: Share strategies and insights with others.
- 🔗 **Broker API Integration** *(coming soon)*: Sync trades automatically from your broker.

---

## 🧪 Currently in BETA

💎 Join our exclusive WhatsApp beta group and get FREE premium access until official released.

---

## 📦 Tech Stack

- Frontend: React + Vite + TypeScript, Tailwind CSS, shadcn/ui
- Backend: Supabase (Postgres, Edge Functions)
- Database: Supabase
- Authentication: Supabase Auth
- Broker APIs: MT5, Binance, OANDA (in progress)

---

## 🛠️ Local development

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # production build in dist/
npm run preview  # serve the production build
```

The `dist/` folder is a static site: deploy it on any host (Vercel, Netlify, Cloudflare Pages, Nginx…).
Configure the host to rewrite every route to `index.html` (single-page app).

### AI Advisor (Supabase Edge Function)

The `ai-advisor` function calls any OpenAI-compatible chat completions API.
Set its secrets in Supabase:

```bash
supabase secrets set AI_API_KEY=your_key
# optional (defaults: Google Gemini)
supabase secrets set AI_API_URL=https://generativelanguage.googleapis.com/v1beta/openai/chat/completions
supabase secrets set AI_MODEL=gemini-2.5-flash
supabase functions deploy ai-advisor
```

### Mobile (Capacitor)

```bash
npm run build
npx cap sync
npx cap open ios   # or android
```

---

## 📲 Live Preview

👉 [www.trades-tracker.com](https://www.trades-tracker.com) *(Public beta)*  
📱 Join our early access community on WhatsApp: [https://chat.whatsapp.com/HA9yKCp4V1b7SsH2WUewQw](#)

---

## 🔮 Coming Soon

- ChatGPT integration
- PDF/Excel export (in progress)
- AI-based trade analysis

---

## 🤝 Contribute

Contributions are welcome!  
Feel free to open an issue or submit a pull request.

---

## 📧 Contact

📨 trades_tracker_officiel@gmail.com  
📷 Instagram: '@trades_tracker_official' 
📷 Twitter: '@trades_track_of'
📷 TikTok: '@trades_tracker_official'


## Dev & design

thanks to Alexandre Berthier for the complet build of our projects
👉 his portfolio: (https://alexandrebrtr.github.io/Alexandre-Berthier---Portfolio/)
