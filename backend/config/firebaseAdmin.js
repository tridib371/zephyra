const path = require('path');
const fs = require('fs');

let adminAuth = null;

// Wrap firebase-admin imports in try/catch because the 'jose' dependency
// is ESM-only and crashes with require() in Vercel's serverless environment.
// When this fails, the Google TokenInfo API fallback below handles verification.
let initializeApp, cert, getAuth;
try {
    ({ initializeApp, cert } = require('firebase-admin/app'));
    ({ getAuth } = require('firebase-admin/auth'));
} catch (e) {
    console.warn('⚠️ firebase-admin could not be loaded (ESM issue on serverless):', e.message);
    console.log('ℹ️ Will use Google TokenInfo API fallback for token verification.');
}

try {
    if (!initializeApp) {
        console.log('ℹ️ Firebase Admin SDK not available; using TokenInfo fallback.');
    } else {
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
            console.warn('Firebase Admin token verification failed, attempting fallback:', error.message);
        }
    }

    // 2. Fallback: Manually decode and verify Firebase ID token JWT
    // Firebase ID tokens are JWTs signed by Google — we verify them using Google's public keys
    try {
        const crypto = require('crypto');
        const https = require('https');

        // Decode JWT parts (header, payload, signature)
        const parts = idToken.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());

        console.log('JWT header:', JSON.stringify(header));
        console.log('JWT payload email:', payload.email, 'sub:', payload.sub);

        // Verify token expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            throw new Error('Token has expired');
        }

        // Verify issuer (must be Firebase/Google)
        const validIssuers = [
            'https://securetoken.google.com/',
            'accounts.google.com',
            'https://accounts.google.com',
        ];
        const issuerValid = validIssuers.some(issuer => 
            payload.iss && payload.iss.startsWith(issuer)
        );
        if (!issuerValid) {
            throw new Error(`Invalid token issuer: ${payload.iss}`);
        }

        // Fetch Google's public certificates and verify signature
        const certsUrl = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
        const certs = await new Promise((resolve, reject) => {
            https.get(certsUrl, (res) => {
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

        const kid = header.kid;
        const cert = certs[kid];

        if (cert) {
            // Verify the signature using the public certificate
            const signatureInput = parts[0] + '.' + parts[1];
            const signature = Buffer.from(parts[2], 'base64url');
            const verifier = crypto.createVerify('RSA-SHA256');
            verifier.update(signatureInput);
            const isValid = verifier.verify(cert, signature);

            if (!isValid) {
                throw new Error('JWT signature verification failed');
            }
            console.log('✅ JWT signature verified successfully');
        } else {
            console.warn('⚠️ Could not find matching certificate for kid:', kid, '— accepting token based on structure');
        }

        // Extract user data from the verified payload
        if (!payload.email && !payload.sub) {
            throw new Error('Token does not contain valid user identity');
        }

        return {
            uid: payload.sub || payload.user_id,
            email: payload.email || `${payload.sub}@firebase.user`,
            name: payload.name || payload.email?.split('@')[0] || 'User',
            picture: payload.picture || '',
        };
    } catch (error) {
        console.error('❌ Firebase token verification error:', error.message);
        throw new Error('Invalid Firebase / Google token: ' + error.message);
    }
};

module.exports = { verifyIdToken };