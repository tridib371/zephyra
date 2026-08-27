const https = require('https');
const fs = require('fs');
const path = require('path');

// Unsplash high quality photo URLs featuring REAL HUMAN ADMINISTRATORS at work
const humanAdminLightUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&auto=format&fit=crop&q=80'; // Human system administrator / IT manager working on laptop and monitors in bright office
const humanAdminDarkUrl = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80'; // Human cybersecurity administrator engineer working late in server command center room with glowing screens

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function run() {
    const assetsDir = path.join(__dirname, '..', 'frontend', 'src', 'assets');
    console.log('Downloading human admin light photo (human IT admin in bright office)...');
    await download(humanAdminLightUrl, path.join(assetsDir, 'admin-bg-light.jpg'));
    console.log('Downloading human admin dark photo (human security admin in server room at night)...');
    await download(humanAdminDarkUrl, path.join(assetsDir, 'admin-bg-dark.jpg'));
    console.log('Done downloading human administrator wallpapers!');
}

run().catch(console.error);
