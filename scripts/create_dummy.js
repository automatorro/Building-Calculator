econst fs = require('fs');

// 1x1 transparent PNG base64
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const buffer = Buffer.from(pngBase64, 'base64');

fs.writeFileSync('dummy.png', buffer);
console.log('dummy.png created');
