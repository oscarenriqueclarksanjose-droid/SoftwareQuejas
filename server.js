const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
// Permitir que se vean index.html y admin.html desde el navegador
app.use(express.static(__dirname));

const FILE_NAME = 'opiniones_clark.csv';

// Crear cabecera si el archivo no existe
if (!fs.existsSync(FILE_NAME)) {
    fs.writeFileSync(FILE_NAME, 'Fecha,Paciente,Servicio,Calificacion,Comentario\n');
}

app.post('/enviar-opinion', (req, res) => {
    const { paciente, servicio, calificacion, comentario } = req.body;
    const fecha = new Date().toLocaleString();
    
    // El \n al final asegura que cada opinión sea una fila nueva
    const nuevaLinea = `${fecha},${paciente},${servicio},${calificacion},${comentario}\n`;

    fs.appendFile(FILE_NAME, nuevaLinea, (err) => {
        if (err) {
            console.error("Error al escribir:", err);
            return res.status(500).json({ mensaje: "Error al guardar localmente" });
        }
        res.json({ mensaje: "¡Opinión guardada con éxito!" });
    });
});

app.get('/ver-opiniones', (req, res) => {
    res.sendFile(path.join(__dirname, FILE_NAME));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Clark corriendo en puerto ${PORT}`);
});