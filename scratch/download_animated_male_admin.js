const https = require('https');
const fs = require('fs');
const path = require('path');

// Direct Unsplash URLs for Single Male Animated System Administrator Artwork
const animatedMaleLightUrl = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80'; // Single male anime/animated developer admin at desk artwork
const animatedMaleDarkUrl = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80'; // Single male animated cyber operator hacker in dark neon server room artwork

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
    console.log('Downloading single male animated admin light photo...');
    await download(animatedMaleLightUrl, path.join(assetsDir, 'admin-bg-light.jpg'));
    console.log('Downloading single male animated admin dark photo...');
    await download(animatedMaleDarkUrl, path.join(assetsDir, 'admin-bg-dark.jpg'));
    console.log('Done downloading single male animated admin wallpapers!');
}

run().catch(console.error);
