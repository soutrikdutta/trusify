# Trusify
### Is it safe to click? Know before you open any link.

Live Demo: [https://trusify.vercel.app](https://trusify.vercel.app)  
Repository: [https://github.com/soutrikdutta/trusify](https://github.com/soutrikdutta/trusify)

## Overview

Have you ever received a suspicious message, email, or chat link like `paypa1-security.com` or `netflix-login-update.xyz` and wondered whether it was safe to click?

Trusify is an automated security scanner that inspects websites and screenshots before users interact with them. Instead of presenting raw technical logs or confusing terminology, Trusify evaluates the link across multiple security layers, generates a calibrated Trust Score between 0 and 100, and provides an explanation in plain language explaining whether the site is authentic, suspicious, or malicious.

## Core Capabilities

1. Instant Link Scanner: Evaluates target domains, server infrastructure, and reputation records in seconds.
2. Screenshot Analyzer: Scans uploaded images of emails, text messages, or interfaces using OCR and vision models to identify spoofed login pages.
3. 0 to 100 Trust Score: An intuitive, calibrated score that reflects the overall risk level of the target.
4. Clear Threat Analysis: Powered by Google Gemini AI, offering practical guidance on why a site was flagged and recommended user actions.
5. Flexible Access: Instant scanning for guest users with local device history, along with optional Google Sign-In for cross-device cloud synchronization.
6. Responsive Interface: Optimized layout for desktop and mobile devices with light and dark theme support.

## Live Demonstration

Access the application at [https://trusify.vercel.app](https://trusify.vercel.app)

1. Enter any link (for example, `github.com` or `chase.com`).
2. Click "Check now".
3. Review the forensic breakdown, certificate details, and trust rating.

## Project Structure

```text
trusify/
├── client/                     # Frontend Application (React, Vite, Tailwind CSS)
│   ├── public/                 # Static assets and icons
│   ├── src/
│   │   ├── components/         # User interface components
│   │   │   ├── Header.jsx               # Navigation bar and account modal
│   │   │   ├── LandingPage.jsx          # Hero section and feature cards
│   │   │   ├── ScannerHub.jsx           # Link and screenshot submission forms
│   │   │   ├── ScanReportBento.jsx      # Forensic results grid
│   │   │   ├── ScanOverlay.jsx          # Active scan progress indicator
│   │   │   ├── TrustGauge.jsx           # Animated score gauge
│   │   │   ├── HistoryView.jsx          # Historical scan records
│   │   │   └── ThreatIntelligenceFeed.jsx # Threat feed and global warnings
│   │   ├── context/            # Application contexts (Auth, Theme)
│   │   ├── lib/                # API clients, Firebase services, local store
│   │   ├── App.jsx             # Main routing and lifecycle management
│   │   ├── index.css           # Styling directives and custom properties
│   │   └── main.jsx            # React root mount
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API Service (Node.js, Express)
│   ├── src/
│   │   ├── routes/
│   │   │   └── scan.js         # Scan endpoints (/api/scan and /api/scan-image)
│   │   ├── services/           # Forensic and Intelligence Services
│   │   │   ├── virustotal.js   # VirusTotal v3 integration (90+ security engines)
│   │   │   ├── safebrowsing.js # Google Safe Browsing API v4
│   │   │   ├── geminiAnalyst.js# Google Gemini multimodal forensic analyst
│   │   │   ├── tlsInspector.js # TLS socket inspection and certificate audit
│   │   │   ├── dnsIntelligence.js # Domain age, MX records, and DNS resolution
│   │   │   └── scoringEngine.js# Deterministic scoring calculation (0-100)
│   │   ├── utils/
│   │   │   ├── ssrf.js         # Anti-SSRF and private network protection
│   │   │   └── urlIntelligence.js # Brand typosquatting and homograph analysis
│   │   └── index.js            # Express server configuration
│   └── package.json
│
├── api/
│   └── index.js                # Serverless deployment handler for Vercel
├── .env.example                # Sample environment configuration template
├── vercel.json                 # Vercel deployment and routing rules
└── README.md                   # Project documentation
```

## Integrated Technologies and Services

| Technology | Purpose in System |
| :--- | :--- |
| React 19 and Vite | Client frontend interface and state management |
| Tailwind CSS and Framer Motion | Modern styling and motion components |
| Node.js and Express | Backend API orchestration and inspection routines |
| Google Gemini AI | Vision OCR, credential trap detection, and plain-language summaries |
| VirusTotal API v3 | Aggregated threat assessment across 90+ antivirus databases |
| Google Safe Browsing v4 | Threat detection for active malware, social engineering, and phishing |
| Node.js Crypto and TLS | Raw socket handshake, certificate validity, issuer, and cipher strength |
| DNS and RDAP | Domain registration timeline, MX mail configuration, and network ASN |
| Firebase Auth and Firestore | Authentication and cloud synchronization for scan history |

## Verification Workflow

When an address is submitted, the inspection engine executes the following verification pipeline:

```text
[ Target Link / Screenshot ]
            │
            ├── 1. SSRF and Validation Filter
            │      Blocks private network ranges, localhost addresses, and invalid syntax.
            │
            ├── 2. Canonical Redirect Resolution
            │      Expands shortened or cloaked URLs to determine the final destination host.
            │
            ├── 3. Threat Intelligence Retrieval
            │      • VirusTotal API (90+ threat engines)
            │      • Google Safe Browsing (Malware and social engineering records)
            │
            ├── 4. Technical Infrastructure Audit
            │      • Domain Age: Flags disposable or newly registered domains.
            │      • TLS/SSL Validation: Audits encryption status, expiry, and issuer authority.
            │      • Brand Impersonation: Compares domain strings against known commercial entities.
            │
            └── 5. Multimodal AI Analysis
                   Synthesizes forensic data, performs OCR on screenshots, and calculates score.
```

## Scoring Methodology

Every scanned destination starts with a baseline score of 100 points. Penalties are deducted based on detected risks and indicators:

| Forensic Indicator | Points Deducted | Risk Rationale |
| :--- | :---: | :--- |
| Google Safe Browsing Detection | -70 points | Target identified as active malware or social engineering threat |
| VirusTotal Detection (3 or more engines) | -60 points | Strong cross-vendor consensus of malicious intent |
| VirusTotal Detection (1 to 2 engines) | -35 points | Suspicious reputation or early threat detection |
| Brand Impersonation or Typosquatting | -50 points | Deliberate character manipulation imitating a known entity |
| Recent Domain Registration (< 14 days) | -25 points | Newly established domains often correlate with disposable phishing |
| Young Domain (14 to 90 days) | -15 points | Domain has not yet established an operational history |
| Unencrypted HTTP Protocol | -30 points | Data in transit is unencrypted and vulnerable to interception |
| Expired TLS/SSL Certificate | -35 points | Broken or lapsed cryptographic identity |
| Untrusted or Self-Signed Certificate | -40 points | Encryption identity cannot be verified by standard trust stores |
| Missing Mail Exchange (MX) Records | -5 points | Domain lacks mail routing configuration |
| Excessive Redirect Chains (> 3 hops) | -15 points | Potential evasion tactic obscuring true target |

### Rating Categories

* 85 to 100 (Safe): Well-established domain, active TLS encryption, and clean reputation records across all engines.
* 60 to 84 (Moderate): Minor warnings present, such as recent registration or recent certificate renewal. Proceed with awareness.
* 40 to 59 (Suspicious): Multiple risk indicators detected. Entering credentials or downloading files is not recommended.
* 0 to 39 (Dangerous): Confirmed malware, active phishing, or severe brand impersonation. Access should be avoided.

## Security and Privacy Policy

* Secure Key Storage: All third-party API credentials remain on the server and are excluded from version control.
* Server-Side Isolation: All target probing and network handshakes are conducted by the server, preventing direct user-to-host exposure.
* Client-Side Privacy: Guest users maintain their scan records exclusively in local browser storage.

## License

This project is licensed under the MIT License.
