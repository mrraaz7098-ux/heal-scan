const fs = require('fs');
const path = require('path');

let db = null;
let attempted = false;

function init() {
  if (attempted) return db;
  attempted = true;

  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT ||
    path.join(__dirname, '..', 'firebase-service-account.json');
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!projectId || !fs.existsSync(serviceAccountPath)) {
    return null;
  }

  try {
    const admin = require('firebase-admin');
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        projectId,
      });
    }
    db = admin.firestore();
    console.log('Firebase initialized (project:', projectId + ')');
  } catch (e) {
    console.error('Firebase init failed:', e.message);
    db = null;
  }
  return db;
}

function isConfigured() {
  return init() !== null;
}

async function pushScan(userId, scan) {
  const firestore = init();
  if (!firestore || !userId || !scan || !scan.id) return null;
  const doc = firestore.collection('scans').doc(String(scan.id));
  await doc.set(
    {
      userId: String(userId),
      id: String(scan.id),
      type: scan.type || 'health',
      title: scan.title || 'Scan',
      createdAt: Number(scan.createdAt || Date.now()),
      result: scan.result || {},
    },
    { merge: true }
  );
  return { id: scan.id };
}

async function getScans(userId) {
  const firestore = init();
  if (!firestore || !userId) return [];
  const snap = await firestore
    .collection('scans')
    .where('userId', '==', String(userId))
    .orderBy('createdAt', 'desc')
    .limit(200)
    .get();
  return snap.docs.map((d) => d.data());
}

module.exports = { isConfigured, pushScan, getScans };
