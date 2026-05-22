const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// CONEXIÓN MAESTRA A MONGODB
const MONGO_URI = "mongodb+srv://admin1:12345@cluster0.z0wjfax.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado a la Bóveda de MongoDB Atlas"))
    .catch(err => console.error("❌ Error de conexión:", err));

// Modelo de datos para las opiniones
const OpinionSchema = new mongoose.Schema({
    fecha: { type: String, default: () => new Date().toLocaleString() },
    paciente: String,
    servicio: String,
    calificacion: Number,
    comentario: String
});
const Opinion = mongoose.model('Opinion', OpinionSchema);

// Recibir opinión del cliente
app.post('/enviar-opinion', async (req, res) => {
    try {
        const nueva = new Opinion(req.body);
        await nueva.save();
        res.json({ mensaje: "¡Opinión recibida y guardada en la nube!" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

// Enviar datos formateados como CSV (para gráficas y descarga)
app.get('/ver-opiniones', async (req, res) => {
    try {
        // Traemos los datos reales de la base de datos
        const opiniones = await Opinion.find().sort({ _id: -1 });
        // Los enviamos como JSON (esto es lo que las gráficas entienden al 100%)
        res.json(opiniones); 
    } catch (error) {
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor Clark listo en puerto ${PORT}`));