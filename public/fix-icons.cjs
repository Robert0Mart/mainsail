const fs = require('fs');
const folder = './public/img/icons/blocks_icons/';
const output = './src/plugins/index.ts';

const files = fs.readdirSync(folder).filter(f => f.endsWith('.svg'));
let data = {};

files.forEach(file => {
    let content = fs.readFileSync(folder + file, 'utf8');
    // Limpa o nome do ficheiro para a variável (ex: temperaturesvg.svg -> temperature)
    let key = file.replace(/\.svg$/i, '').replace(/svg$/i, '').replace(/[- ]/g, '_');
    
    let combined = "";

    // Captura apenas as coordenadas dos caminhos (d)
    const paths = content.match(/d="([^"]*)"/g);
    if (paths) {
        paths.forEach(d => {
            let val = d.split('"')[1];
            // Remove "Layer_1" ou qualquer texto que não seja coordenadas
            val = val.replace(/[a-zA-Z_]+\d*/g, (match) => {
                // Mantém apenas as letras de comando SVG (M, L, C, Z, etc)
                return match.length === 1 ? match : '';
            });
            combined += val + " ";
        });
    }

    data[key] = combined.trim();
});

fs.writeFileSync(output, `export const icons = ${JSON.stringify(data, null, 2)};`);
console.log("✅ Sucesso! Ficheiro index.ts limpo e atualizado.");