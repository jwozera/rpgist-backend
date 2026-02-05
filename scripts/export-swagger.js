const fs = require('fs');
const path = require('path');

const distSwaggerPath = path.resolve(__dirname, '..', 'dist', 'config', 'swagger.js');
const outputDir = path.resolve(__dirname, '..', 'docs');
const outputFile = path.join(outputDir, 'swagger.json');

let swaggerDocument;

try {
  const loaded = require(distSwaggerPath);
  swaggerDocument = loaded.default ?? loaded;
} catch (error) {
  console.error('Failed to load compiled swagger document at', distSwaggerPath);
  console.error(error);
  process.exit(1);
}

if (!swaggerDocument || typeof swaggerDocument !== 'object') {
  console.error('Swagger document was not found or is invalid.');
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(swaggerDocument, null, 2));

console.log('Swagger JSON exported to', outputFile);
