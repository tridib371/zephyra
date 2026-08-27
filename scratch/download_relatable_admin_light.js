const https = require('https');
const fs = require('fs');
const path = require('path');

// Photo URLs for Admin Security Control Desk / User Management Dashboard
const candidateUrls = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80', // Admin dashboard analytics on laptop desk
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&auto=format&fit=crop&q=80', // Data analytics and admin control panel desk
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&auto=format&fit=crop&q=80', // Administrator team monitoring dashboard on laptop
];

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
    console.log('Downloading relatable admin light photo...');
    await download(candidateUrls[0], path.join(assetsDir, 'admin-bg-light.jpg'));
    console.log('Done downloading relatable admin light wallpaper!');
}

run().catch(console.error);
