import Schema from 'validate'

const userSchema = new Schema({
    usuario: { type: String },
    pass: { type: String },
    nombre: { type: String },
    ultimo_inicio_sesion: { type: Date },
    tipo: { type: String, enum: ["desarrollo", "implementacion", "administrador", "usuario"] },
    maximo_tiempo_session_inactiva: {
        type: Number,
        size: {
            length: 2
        }
    }
})

export default userSchema