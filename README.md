# Matty's Christening Invitation

A digital invitation website for the Christening of **Alford Matthias "Matty" Sevilla**. Built with modern HTML5, CSS3, vanilla JavaScript, and Web Audio API, featuring real-time Google Sheets RSVP integration, multi-layer bot protection, and personalized VIP guest invitation links.

---

## 🌐 Live Demo & Deployment

- **Live Website**: [https://rynp.github.io/invitation/](https://rynp.github.io/invitation/)
- **Repository**: [https://github.com/rynp/invitation](https://github.com/rynp/invitation)
- **Deployment**: Automated GitHub Pages CI/CD workflow via GitHub Actions (`main` and `gh-pages` branches).

---

## ✨ Features & Architecture

### 1. Visuals, Animations & Interactive Experience
- **Animated Curtain Entrance**: Double-door sliding panels with custom `cubic-bezier(.77, 0, .18, 1)` easing, gold border accents, and a wax-seal dialog card (*Open Invitation* & *Open without music*).
- **Lullaby Music Synthesizer**: Native **Web Audio API** synthesizer playing custom melody and bassline notes using triangle and sine wave oscillators with exponential decay. 100% reliable with zero external MP3 assets, completely offline-capable, and automatically pauses when switching browser tabs.
- **Floating Music Player**: Fixed top-right audio toggle button (`#mu`) with animated active state, play/pause symbols (`❚❚` / `♪`), and mobile notch/safe-area spacing.
- **Hero Header**: Floating celestial twinkling stars (`✦` / `✧`), floating portrait ring bounce animation, and italic *Cormorant Garamond* serif typography.
- **Real-Time Countdown Timer**: Live reactive countdown calculating Days, Hours, Minutes, and Seconds until August 19, 2026 (`2026-08-19T00:00:00+08:00`), updating every 1000ms.
- **Photo Galleries & Event Details**: Custom arch-framed baby portraits (`.pair .frame`), family section, event details cards with direct Google Maps external links, timeline schedule with milestone gold markers, godparents cards, and attire color swatches.
- **Scroll Transitions**: Smooth `IntersectionObserver` scroll-triggered fade-in transitions (`.fade.in`).

---

### 2. Real-Time Google Sheets RSVP Integration
- **Direct Webhook Submission**: Connected to a Google Apps Script Web App endpoint that receives responses via cross-origin asynchronous requests.
- **Automated Logging**: Captures `Timestamp`, `Full Name`, `Attendees` count (1–10), `Attending` status (Attending / Unable to attend), and an optional `Message`, appending each entry as a new row in Google Sheets in real time.
- **Dynamic Feedback**: Real-time validation, animated submission state (`Sending…`), and personalized confirmation cards upon completion.

---

### 3. Multi-Layer Anti-Bot & Spam Protection
A non-intrusive 6-layer defense system that shields your Google Sheet from automated crawlers and spam bots:
1. **Native Security Challenge (CAPTCHA)**: A lightweight, gold-styled math verification widget (`3 + 4 = ?`) with a refresh button. Real guests solve it in seconds with zero friction; requires no third-party accounts, tracking scripts, or API keys.
2. **Invisible Honeypot Trap**: A hidden off-screen input (`website_url`) that automated bots inspect and fill, but real users never see. If populated, submissions are silently discarded without polluting your spreadsheet.
3. **Submission Timing Validation**: Headless spam bots submit forms in milliseconds. Submissions occurring in under 2 seconds from initial page load are flagged and rejected.
4. **URL / Link Filter**: Rejects guest names containing web links (`http://`, `https://`, `www.`).
5. **Session Rate Limiting**: Prevents rapid repeated submissions from the same browser session.
6. **Secret Authentication Token**: Transmits an internal signature (`matty-christening-2026`) that Google Apps Script verifies before recording data.

---

### 4. Security & Privacy Hardening
- **Client-Side XSS Prevention**: All dynamic guest names rendered in confirmation cards are sanitized via `escapeHtml()` to block script or HTML injection.
- **Spreadsheet Formula Injection Defense**: Pre-sanitizes input cells on the server side by prefixing entries that begin with `=`, `+`, `-`, or `@` with a single quote (`'`), preventing executable formula execution in Google Sheets or exported CSV files.
- **Data Privacy Lockdown**: Google Apps Script `doGet` requests are secured to ensure visitors cannot scrape or view existing RSVP responses.

---

### 5. Personalized VIP Guest Links (`?to=GuestName`)
Supports personalized invitations when sharing links individually with family and godparents:
- **Example URL**: `https://rynp.github.io/invitation/?to=Ninong+Daniel`
- **Curtain Greeting**: The seal card displays: **"Dear Ninong Daniel,"** above the invitation.
- **Hero Welcome**: The hero header displays: **"Warmly Welcoming Ninong Daniel"**.
- **Auto-Filled RSVP**: The **Full Name** field in the RSVP form is automatically pre-filled, making responding effortless for guests.
- **General Fallback**: Standard links without query parameters display the general invitation cleanly with zero placeholder gaps.

---

## 🛠 Local Development

Open `index.html` directly in any web browser, or run a local static server:

```bash
# Using Node
npm start
# or
npx serve .

# Using Python
python -m http.server 3000
```
