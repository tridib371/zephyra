const https = require('https');
const fs = require('fs');
const path = require('path');

const lightUrl = 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=1600&auto=format&fit=crop&q=80'; // Contact email & mail desk
const darkUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop&q=80'; // Dark customer support & contact center desk

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
    console.log('Downloading contact light photo...');
    await download(lightUrl, path.join(assetsDir, 'contact-bg-light.jpg'));
    console.log('Downloading contact dark photo...');
    await download(darkUrl, path.join(assetsDir, 'contact-bg-dark.jpg'));
    console.log('Done!');
}

run().catch(console.error);
