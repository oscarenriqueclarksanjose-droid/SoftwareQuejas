const fs = require('fs');
const axios = require('axios');

async function bajarExcel() {
    console.log("⏳ Descargando datos desde la nube...");
    try {
        const res = await axios.get('https://softwarequejas.onrender.com/ver-opiniones');
        fs.writeFileSync('opiniones_clark_FINAL.csv', res.data);
        console.log("✅ ¡Éxito! El archivo 'opiniones_clark_FINAL.csv' ha sido actualizado.");
    } catch (e) {
        console.log("❌ Error:", e.message);
    }
}

bajarExcel();