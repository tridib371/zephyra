const https = require('https');
const fs = require('fs');
const path = require('path');

// Direct Unsplash URLs for System Administration & Server Data Center Control Rooms
const lightUrl = 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&auto=format&fit=crop&q=80'; // Cybersecurity admin & network monitoring desk
const darkUrl = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80'; // Server data center & network admin room

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
    console.log('Downloading true admin light photo (cybersecurity & network ops desk)...');
    await download(lightUrl, path.join(assetsDir, 'admin-bg-light.jpg'));
    console.log('Downloading true admin dark photo (server room data center)...');
    await download(darkUrl, path.join(assetsDir, 'admin-bg-dark.jpg'));
    console.log('Done downloading true admin wallpapers!');
}

run().catch(console.error);
