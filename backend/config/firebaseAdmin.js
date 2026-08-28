const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');
const fs = require('fs');

let adminAuth = null;

try {
    let serviceAccount = null;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            console.log('✅ Loaded Firebase service account from process.env.FIREBASE_SERVICE_ACCOUNT');
        } catch (e) {
            console.warn('⚠️ Could not parse process.env.FIREBASE_SERVICE_ACCOUNT JSON:', e.message);
        }
    }

    const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
    if (!serviceAccount && fs.existsSync(serviceAccountPath)) {
        try {
            serviceAccount = require(serviceAccountPath);
            console.log('✅ Loaded Firebase service account from file');
        } catch (e) {
            console.warn('⚠️ Could not read firebase-service-account.json file:', e.message);
        }
    }

    if (serviceAccount) {
        let app;
        if (!global._firebaseApp) {
            app = initializeApp({ credential: cert(serviceAccount) });
            global._firebaseApp = app;
        } else {
            app = global._firebaseApp;
        }
        adminAuth = getAuth(app);
        console.log('✅ Firebase Admin SDK initialized successfully');
    } else {
        console.log('ℹ️ No Firebase Service Account found; using Google TokenInfo verification fallback for cloud deployment.');
    }
} catch (error) {
    console.warn('⚠️ Firebase Admin SDK initialization skipped:', error.message);
}

const verifyIdToken = async (idToken) => {
    // 1. Try Firebase Admin SDK if available
    if (adminAuth) {
        try {
            const decodedToken = await adminAuth.verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            console.warn('Firebase Admin token verification failed, attempting Google TokenInfo API fallback:', error.message);
        }
    }

    // 2. Universal Fallback: Verify ID token using Google TokenInfo API
    try {
        const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
        let data;

        if (typeof fetch === 'function' || typeof globalThis.fetch === 'function') {
            const httpFetch = globalThis.fetch || fetch;
            const res = await httpFetch(url);
            if (!res.ok) {
                throw new Error(`Token verification failed with status ${res.status}`);
            }
            data = await res.json();
        } else {
            const https = require('https');
            data = await new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    let body = '';
                    res.on('data', (chunk) => (body += chunk));
                    res.on('end', () => {
                        try {
                            resolve(JSON.parse(body));
                        } catch (e) {
                            reject(e);
                        }
                    });
                }).on('error', reject);
            });
        }

        if (!data || !data.email) {
            throw new Error(data?.error_description || 'Token does not contain valid email');
        }
        return {
            uid: data.sub || data.user_id,
            email: data.email,
            name: data.name || data.email.split('@')[0],
            picture: data.picture || '',
        };
    } catch (error) {
        console.error('❌ TokenInfo verification error:', error.message);
        throw new Error('Invalid Firebase / Google token: ' + error.message);
    }
};

module.exports = { verifyIdToken };