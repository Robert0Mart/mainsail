// public/img/icons/blocks_icons/generate-icons.cjs
const fs = require('fs')
const path = require('path')
const extract = require('extract-svg-path') // npm install extract-svg-path

// SVGs e script estão na mesma pasta
const iconsDir = path.join(__dirname, '.')   // mesma pasta
const outputFile = path.join(__dirname, 'index.ts')

function getIconName(filename) {
  return path.basename(filename, '.svg')
}

const icons = {}

fs.readdirSync(iconsDir)
  .filter((file) => file.endsWith('.svg'))
  .forEach((file) => {
    const fullPath = path.join(iconsDir, file)
    icons[getIconName(file)] = JSON.stringify(extract(fullPath))
  })

const content = `
// icons library (same folder as SVGs)
// gerado automaticamente por public/img/icons/blocks_icons/generate-icons.cjs

export const icons = {
${Object.entries(icons)
  .map(([name, pathData]) => `  ${name}: ${pathData}`)
  .join(',\n')}
}
`

fs.writeFileSync(outputFile, content)
console.log('✅ index.ts gerado com sucesso na mesma pasta.')