import Schema from 'validate'

const docSchema = new Schema({
    titulo: {
        type: String
    },
    documento: {
        type: String
    },
    autor: {
        usuario: {
            type: String
        },
        nombre: {
            type: String
        }
    },
    modificado_por: {
        usuario: {
            type: String
        },
        nombre: {
            type: String
        }
    },
    fecha_creacion: {
        type: String
    },
    fecha_modificacion: {
        type: String
    },
    historial_cambios: [{
        documento: {
            type: String
        },
        fecha: {
            type: String
        }, fecha_server: {
            type: Date
        },
        autor_cambio: {
            usuario: {
                type: String
            },
            nombre: {
                type: String
            }
        }
    }]
})

export default docSchema