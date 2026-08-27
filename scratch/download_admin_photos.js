const https = require('https');
const fs = require('fs');
const path = require('path');

// Unsplash high quality photo URLs for Master Admin Control Center & Cyber Network Ops
const lightUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80'; // Modern executive analytics dashboard & network control desk
const darkUrl = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80'; // Dark high-tech server room & cybersecurity command center at night

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
    console.log('Downloading admin light photo...');
    await download(lightUrl, path.join(assetsDir, 'admin-bg-light.jpg'));
    console.log('Downloading admin dark photo...');
    await download(darkUrl, path.join(assetsDir, 'admin-bg-dark.jpg'));
    console.log('Done downloading admin wallpapers!');
}

run().catch(console.error);
