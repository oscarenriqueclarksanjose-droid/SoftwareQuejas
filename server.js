const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Librería para manejar archivos
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ARCHIVO_EXCEL = 'opiniones_clark.csv';

// Si el archivo no existe, creamos la cabecera del Excel
if (!fs.existsSync(ARCHIVO_EXCEL)) {
    const cabecera = "Fecha,Paciente,Servicio,Calificacion,Comentario\n";
    fs.writeFileSync(ARCHIVO_EXCEL, cabecera, 'utf8');
}

app.post('/enviar-opinion', (req, res) => {
    const { paciente, servicio, calificacion, comentario } = req.body;

    // Formatear los datos para el Excel (CSV)
    const fecha = new Date().toLocaleString();
    const nombre = paciente || "Anonimo";
    // Limpiamos comas del comentario para no romper el formato CSV
    const comentarioLimpio = comentario.replace(/,/g, "."); 
    
    const nuevaLinea = `${fecha},${nombre},${servicio},${calificacion},${comentarioLimpio}\n`;

    // GUARDAR EN EL ARCHIVO (Añadir al final)
    fs.appendFile(ARCHIVO_EXCEL, nuevaLinea, (err) => {
        if (err) {
            console.error("Error al guardar en Excel:", err);
            return res.status(500).send({ mensaje: "Error interno al guardar." });
        }
        console.log("¡Dato guardado en Excel con éxito!");
        res.send({ mensaje: "Gracias. Su opinión ha sido registrada en el sistema de Laboratorios Clark." });
    });
});

app.get('/ver-opiniones', (req, res) => {
    // Ahora leemos directamente el archivo para mostrarlo
    fs.readFile(ARCHIVO_EXCEL, 'utf8', (err, data) => {
        if (err) return res.send("Aún no hay opiniones.");
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor Clark activo. Guardando datos en: ${ARCHIVO_EXCEL}`);
});