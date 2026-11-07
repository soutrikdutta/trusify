import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { scanRouter } from './routes/scan.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite development & production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve built React client assets if available
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Health & Info Check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    service: 'Trusify Digital Trust & Web Threat Intelligence API',
    integrations: {
      virusTotal: !!process.env.VIRUSTOTAL_API_KEY,
      safeBrowsing: !!process.env.SAFE_BROWSING_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY
    },
    timestamp: new Date().toISOString()
  });
});

// Threat Scan Router (handles both /api/scan and /scan)
app.use(['/api/scan', '/scan'], scanRouter);

// SPA fallback for non-API routes so direct navigation works
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Turify Security Intelligence</title></head>
        <body style="font-family:sans-serif;padding:40px;background:#090D16;color:#F8FAFC;">
          <h2>Turify API Server is Online (Port 5000)</h2>
          <p>Frontend UI is running at <a href="http://localhost:3000" style="color:#3B82F6;">http://localhost:3000</a></p>
          <p>API Health: <a href="/api/health" style="color:#3B82F6;">/api/health</a></p>
        </body>
        </html>
      `);
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Turify API] Server active and listening on port ${PORT}`);
    console.log(`[VirusTotal] API configured: ${!!process.env.VIRUSTOTAL_API_KEY}`);
    console.log(`[SafeBrowsing] API configured: ${!!process.env.SAFE_BROWSING_API_KEY}`);
    console.log(`[Gemini] API configured: ${!!process.env.GEMINI_API_KEY}`);
  });
}

export default app;
