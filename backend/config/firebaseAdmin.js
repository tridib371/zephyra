const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');
const fs = require('fs');

// Check if service account file exists
const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');

console.log('🔍 Looking for service account at:', serviceAccountPath);

if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ firebase-service-account.json not found in backend folder!');
    console.error('📁 Contents of backend folder:', fs.readdirSync(path.join(__dirname, '..')));
    process.exit(1);
}

console.log('✅ Service account file found!');

try {
    const serviceAccount = require(serviceAccountPath);
    console.log('✅ Service account loaded successfully');

    // Initialize Firebase Admin SDK using the new modular approach
    let app;
    if (!global._firebaseApp) {
        app = initializeApp({
            credential: cert(serviceAccount),
        });
        global._firebaseApp = app;
        console.log('✅ Firebase Admin SDK initialized successfully');
    } else {
        app = global._firebaseApp;
        console.log('✅ Firebase Admin SDK already initialized');
    }

    const auth = getAuth(app);

    const verifyIdToken = async (idToken) => {
        try {
            const decodedToken = await auth.verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            console.error('❌ Firebase token verification error:', error);
            throw new Error('Invalid Firebase token');
        }
    };

    module.exports = { verifyIdToken };
} catch (error) {
    console.error('❌ Error loading Firebase Admin SDK:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1);
}