const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// CONEXIÓN A MONGODB (Usa tus credenciales de Atlas)
const MONGO_URI = "mongodb+srv://admin1:12345@cluster0.z0wjfax.mongodb.net/LaboratorioClark?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conexión exitosa a MongoDB Atlas"))
    .catch(err => console.error("❌ Error de conexión:", err));

// Esquema de la Opinión
const OpinionSchema = new mongoose.Schema({
    fecha: { type: String, default: () => new Date().toLocaleString() },
    paciente: String,
    servicio: String,
    calificacion: Number,
    comentario: String
});
const Opinion = mongoose.model('Opinion', OpinionSchema);

// RUTA: Guardar opinión
app.post('/enviar-opinion', async (req, res) => {
    try {
        const nueva = new Opinion(req.body);
        await nueva.save();
        res.json({ mensaje: "¡Opinión guardada en la nube con éxito!" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar" });
    }
});

// RUTA: Ver opiniones (JSON para el Dashboard)
app.get('/ver-opiniones', async (req, res) => {
    try {
        const opiniones = await Opinion.find().sort({ _id: -1 });
        res.json(opiniones);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

// RUTA: Eliminar una reseña específica por ID
app.delete('/eliminar-opinion/:id', async (req, res) => {
    try {
        await Opinion.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Reseña eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "No se pudo eliminar la reseña" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor Clark activo en puerto ${PORT}`));