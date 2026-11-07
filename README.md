# TRUSIFY 🛡️
### *Is it safe to click? Know before you open any link.*

> **Live Demo Website:** 👉 **[https://trusify.vercel.app](https://trusify.vercel.app)**  
> **Source Code:** [https://github.com/soutrikdutta/trusify](https://github.com/soutrikdutta/trusify)

---

## 🌟 What is Trusify? (Simple Explanation)

Have you ever received a suspicious text message, email, or WhatsApp message with a link like `paypa1-security.com` or `netflix-login-update.xyz` and wondered: **"Is this a scam? Is it safe to click?"**

**Trusify** is a smart, easy-to-use security scanner that checks any link or screenshot for you before you risk opening it. 

Instead of showing confusing technical jargon or complicated code, Trusify gives you a **clear Trust Score from 0 to 100** and explains in **plain, simple English** whether the website is real, suspicious, or an outright scam.

---

## ✨ Key Features

1. 🔍 **Instant Link Scanner**: Simply paste any link, and Trusify performs a deep security scan in seconds.
2. 📸 **Screenshot Analyzer**: Upload a screenshot of a suspicious message, email, or login screen. Our AI reads the image and warns you if it is a fake login trap.
3. 🎯 **0 to 100 Trust Score**: Get an easy-to-read score (like a school exam mark) so you immediately know if a site is trustworthy.
4. 🤖 **Plain-English AI Explanations**: Powered by Google Gemini AI, Trusify explains *why* a link is dangerous and tells you what to do (e.g., "Do not enter your password here").
5. 👤 **Guest & Account Modes**: Scan right away as a guest (your history is saved safely on your device) or sign in with Google to sync your scan history anywhere.
6. 📱 **Mobile & Dark Mode Ready**: Fully responsive design with a clean, modern interface and dark mode support.

---

## 🚀 Try It Live

Visit the live app: **[https://trusify.vercel.app](https://trusify.vercel.app)**

1. Paste any website link (for example: `github.com` or `chase.com`).
2. Click **Check now**.
3. Watch Trusify analyze the website live and give you a detailed safety report!

---

## 🏗️ Project Structure

Here is how the project is organized:

```text
trusify/
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── public/                 # Static assets & icons (trusify-icon.svg)
│   ├── src/
│   │   ├── components/         # User interface components
│   │   │   ├── Header.jsx               # Navigation bar & authentication modal
│   │   │   ├── LandingPage.jsx          # Hero section, feature cards & live demo input
│   │   │   ├── ScannerHub.jsx           # Main scanning input area (URL + Screenshot upload)
│   │   │   ├── ScanReportBento.jsx      # Clean report cards showing results
│   │   │   ├── ScanOverlay.jsx          # Live scanning animation overlay
│   │   │   ├── TrustGauge.jsx           # Animated circular 0-100 score speedometer
│   │   │   ├── HistoryView.jsx          # Past scan history (Guest local storage / Firebase)
│   │   │   └── ThreatIntelligenceFeed.jsx # Live community threat alerts
│   │   ├── context/            # React Contexts (AuthContext, ThemeContext)
│   │   ├── lib/                # API helpers, Firebase setup, and local storage store
│   │   ├── App.jsx             # Main Application routing and state
│   │   ├── index.css           # Tailwind styling & smooth animations
│   │   └── main.jsx            # React root entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── routes/
│   │   │   └── scan.js         # Main scan endpoints (/api/scan and /api/scan-image)
│   │   ├── services/           # The Security Inspection Engines
│   │   │   ├── virustotal.js   # VirusTotal API integration (90+ antivirus engines)
│   │   │   ├── safebrowsing.js # Google Safe Browsing API (malware & phishing)
│   │   │   ├── geminiAnalyst.js# Google Gemini AI (plain English analysis & OCR)
│   │   │   ├── tlsInspector.js # SSL/TLS certificate check (encryption & issuer)
│   │   │   ├── dnsIntelligence.js # Domain age, MX records & IP resolution
│   │   │   └── scoringEngine.js# Mathematical calculation of the 0-100 Trust Score
│   │   ├── utils/
│   │   │   ├── ssrf.js         # Anti-SSRF protection (blocks private IP attacks)
│   │   │   └── urlIntelligence.js # Detects fake brand spellings (e.g. paypa1.com)
│   │   └── index.js            # Express server initialization
│   └── package.json
│
├── api/
│   └── index.js                # Serverless entry point for Vercel deployment
├── .env.example                # Template showing required API key environment variables
├── vercel.json                 # Vercel deployment routing configuration
└── README.md                   # Project documentation
```

---

## 🛠️ Technologies & Services Used

| Tool / Technology | What It Does in Trusify |
| :--- | :--- |
| **React 19 & Vite** | Powers the ultra-fast, smooth frontend interface. |
| **Tailwind CSS & Framer Motion** | Provides the modern design, floating security shield animations, and glassmorphic cards. |
| **Node.js & Express** | Runs the backend server that securely conducts all forensic checks. |
| **Google Gemini AI** | Reads screenshots, detects fake login forms, and writes the plain-English risk advice. |
| **VirusTotal API v3** | Checks the link against over 90 world-leading antivirus and security databases. |
| **Google Safe Browsing v4** | Detects active malware links, phishing attempts, and scam websites. |
| **Node.js Crypto & TLS** | Performs a cryptographic handshake to verify that the website's SSL lock is genuine and valid. |
| **DNS & RDAP (WHOIS)** | Checks who owns the domain, how old the website is, and whether it has real email servers. |
| **Firebase Auth & Firestore** | Handles Google Sign-In and saves scan history to the cloud (with automatic guest device fallback). |

---

## 🔬 How We Verify a Link (Step-by-Step)

When you submit a link to Trusify, our system runs 5 automated checks in parallel:

```
[ Your Link / Screenshot ]
            │
            ├──▶ 1. Safety Guard Check: Blocks dangerous internal network addresses and invalid inputs.
            │
            ├──▶ 2. Redirect Unwrapper: Follows shortened links (like bit.ly) to reveal their real final destination.
            │
            ├──▶ 3. Security Database Checks:
            │       • VirusTotal (90+ Antivirus engines)
            │       • Google Safe Browsing (Malware & Phishing records)
            │
            ├──▶ 4. Technical Inspection:
            │       • Domain Age: Is the site brand new (created 2 days ago)? Scams often use fresh domains.
            │       • SSL Lock: Does it have a genuine, valid security certificate?
            │       • Brand Imitation: Does it copy real brand names (like paypa1.com instead of paypal.com)?
            │
            └──▶ 5. Gemini AI Analysis:
                    • Understands the context, explains the findings in simple words, and awards a final score!
```

---

## 📊 How "Marks" / Trust Scores are Awarded (0 to 100)

Every website starts with a **perfect score of 100 points**.  
Points are deducted whenever a security warning or scam signal is found:

| Detection / Issue Found | Points Deducted | Why? |
| :--- | :---: | :--- |
| **Google Safe Browsing Flag** | **-70 points** | The site is confirmed to host active malware or phishing traps. |
| **Flagged by 3 or more Antiviruses** | **-60 points** | Multiple global security engines agree the site is dangerous. |
| **Flagged by 1 or 2 Antiviruses** | **-35 points** | Suspicious behavior detected by security scanners. |
| **Fake Brand Name / Typosquatting** | **-50 points** | The link is intentionally misspelling a popular brand (like PayPal or Apple) to fool you. |
| **Brand New Domain (Less than 14 days old)** | **-25 points** | Scammers frequently register new domains that vanish within a week. |
| **Young Domain (14 to 90 days old)** | **-15 points** | Domain has not yet established a proven track record. |
| **No HTTPS / Insecure Connection** | **-30 points** | Information sent to the website is not encrypted. |
| **Expired SSL Certificate** | **-35 points** | The website's security lock has expired or is broken. |
| **Self-Signed / Untrusted SSL** | **-40 points** | The security certificate cannot be trusted by standard browsers. |
| **No Email (MX) Records** | **-5 points** | Legitimate companies usually have mail records; throwaway scam sites often omit them. |
| **Excessive Redirects (> 3 hops)** | **-15 points** | Scammers use multiple redirects to hide their final trap. |

### 🏆 Score Badges:
* 🟢 **85 – 100 (Safe)**: The website is well-established, secure, and has a clean reputation.
* 🟡 **60 – 84 (Moderate)**: Minor concerns (such as a newer domain or recent certificate change). Proceed with normal caution.
* 🟠 **40 – 59 (Suspicious)**: Multiple red flags detected. Do not enter personal details or passwords.
* 🔴 **0 – 39 (Dangerous)**: Known scam, phishing site, or malware distributor. **Do not open!**

---

## 💻 Local Setup & Installation

If you want to run Trusify on your own computer:

### 1. Clone the repository
```bash
git clone https://github.com/soutrikdutta/trusify.git
cd trusify
```

### 2. Configure Environment Variables
Create a `.env` file in the root folder (or copy from `.env.example`):
```bash
cp .env.example .env
```
Add your free API keys in `.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
SAFE_BROWSING_API_KEY=your_google_safe_browsing_key_here
```

### 3. Install Dependencies & Start

**Start the Backend Server:**
```bash
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000`.*

**Start the Frontend App:**
```bash
cd client
npm install
npm run dev
```
*Frontend opens on `http://localhost:3000`.*

---

## 🔒 Privacy & Safety Notice
- **Zero Secret Exposure**: Secret API keys are stored only in server environment files and are never exposed to the browser or public repository.
- **Client Safe**: Link checking is performed on the server side so your device never makes direct contact with malicious websites during inspection.
- **Device Storage**: Guest users have their scan history stored privately in their own browser's local storage.

---

## 📄 License
This project is open-source and available under the **MIT License**.
