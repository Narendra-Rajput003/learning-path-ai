const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const LOGO_SIZES = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
  'og-image.png': [1200, 630],
  'twitter-image.png': [1200, 630]
};

async function generateIcons() {
  // Base SVG for the logo
  const svg = `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="url(#gradient)" rx="128"/>
      <path d="M256 128C192 128 144 176 144 240C144 304 192 352 256 352C320 352 368 304 368 240C368 176 320 128 256 128ZM256 320C209.6 320 176 286.4 176 240C176 193.6 209.6 160 256 160C302.4 160 336 193.6 336 240C336 286.4 302.4 320 256 320Z" fill="white"/>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#6366F1"/>
          <stop offset="50%" stop-color="#A855F7"/>
          <stop offset="100%" stop-color="#EC4899"/>
        </linearGradient>
      </defs>
    </svg>
  `;

  // Create public directory if it doesn't exist
  await fs.mkdir('public', { recursive: true });

  // Generate icons
  for (const [filename, size] of Object.entries(LOGO_SIZES)) {
    const width = Array.isArray(size) ? size[0] : size;
    const height = Array.isArray(size) ? size[1] : size;

    if (filename.includes('og-image') || filename.includes('twitter-image')) {
      // Generate social media preview images
      await sharp(Buffer.from(svg))
        .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0 } })
        .composite([{
          input: Buffer.from(`
            <svg width="${width}" height="${height}">
              <text x="50%" y="50%" font-family="Arial" font-size="64" fill="white" text-anchor="middle">
                LearningPath.ai
              </text>
            </svg>
          `),
          top: 0,
          left: 0,
        }])
        .toFile(path.join('public', filename));
    } else {
      // Generate regular icons
      await sharp(Buffer.from(svg))
        .resize(width, height)
        .toFile(path.join('public', filename));
    }
  }

  // Generate favicon.ico (multi-size)
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .toFormat('ico')
    .toFile(path.join('public', 'favicon.ico'));
}

generateIcons().catch(console.error);