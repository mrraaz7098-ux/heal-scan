require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { validateBase64Image, analyzeHealth, analyzeFood, MODEL } = require('./openaiClient');
const firebase = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json({ limit: '12mb' }));

const PORT = process.env.PORT || 4000;

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    model: MODEL,
    time: new Date().toISOString(),
  });
});

function handleScan(req, res, analyzer) {
  const { image, prompt } = req.body || {};
  const validated = validateBase64Image(image);
  if (typeof validated === 'string') {
    return res.status(400).json({ error: validated });
  }

  analyzer({ base64Data: validated.base64, mime: validated.mime })
    .then((result) => {
      res.json({ ok: true, model: MODEL, result });
    })
    .catch((err) => {
      const status = err && err.status ? err.status : 500;
      const message =
        err && err.error && err.error.message
          ? err.error.message
          : err.message || 'Analysis failed';
      console.error('[analyze error]', err);
      res.status(status).json({ ok: false, error: message });
    });
}

app.post('/api/scan/health', (req, res) => handleScan(req, res, analyzeHealth));
app.post('/api/scan/food', (req, res) => handleScan(req, res, analyzeFood));

app.post('/api/sync/push', async (req, res) => {
  if (!firebase.isConfigured()) {
    return res
      .status(503)
      .json({ ok: false, synced: false, error: 'Cloud sync is not configured on the server.' });
  }
  const { userId, scan } = req.body || {};
  if (!userId || !scan || !scan.id) {
    return res.status(400).json({ ok: false, error: 'userId and scan.id are required.' });
  }
  try {
    await firebase.pushScan(userId, scan);
    res.json({ ok: true, synced: true, id: scan.id });
  } catch (e) {
    console.error('[sync push error]', e.message);
    res.status(500).json({ ok: false, synced: false, error: e.message });
  }
});

app.get('/api/sync/history', async (req, res) => {
  if (!firebase.isConfigured()) {
    return res
      .status(503)
      .json({ ok: false, synced: false, scans: [], error: 'Cloud sync is not configured on the server.' });
  }
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ ok: false, error: 'userId is required.' });
  }
  try {
    const scans = await firebase.getScans(userId);
    res.json({ ok: true, synced: true, scans });
  } catch (e) {
    console.error('[sync history error]', e.message);
    res.status(500).json({ ok: false, synced: false, scans: [], error: e.message });
  }
});

app.use((req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`Heal Scan API running on http://localhost:${PORT}`);
  console.log(`Model: ${MODEL}`);
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('REPLACE')) {
    console.warn('WARNING: OPENAI_API_KEY is not set. Set it in .env to enable AI scans.');
  }
});
