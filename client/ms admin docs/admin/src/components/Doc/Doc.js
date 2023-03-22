export default class Doc {
    constructor(id, titulo, documento, autor, modificado_por, fecha_creacion, fecha_modificacion, historial_cambios) {
        this.id = id
        this.titulo = titulo
        this.documento = documento
        this.autor = autor
        // {
        //     usuario: '',
        //     nombre: ''
        // }
        this.modificado_por = {
            usuario: '',
            nombre: ''
        }
        this.fecha_creacion = ''
        this.fecha_modificacion = ''
        // historial_cambios = [{
        //     documento: '',
        //     fecha: '',
        //     fecha_server: '',
        //     autor_cambio: {
        //         usuario: '',
        //         nombre: ''
        //     }
        // }]
    }



}