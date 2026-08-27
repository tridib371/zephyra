const https = require('https');
const fs = require('fs');
const path = require('path');

// Unsplash high quality photo URLs for Community Guidelines & Ethics Sanctuary
const lightUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80'; // Creative team roundtable & community discussion desk
const darkUrl = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&auto=format&fit=crop&q=80'; // Dark community workshop & collaboration desk at night

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
    console.log('Downloading guidelines light photo...');
    await download(lightUrl, path.join(assetsDir, 'guidelines-bg-light.jpg'));
    console.log('Downloading guidelines dark photo...');
    await download(darkUrl, path.join(assetsDir, 'guidelines-bg-dark.jpg'));
    console.log('Done downloading guidelines wallpapers!');
}

run().catch(console.error);
