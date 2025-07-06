export interface Region {
    id?: string;
    nombre: string;
}

export interface Comuna {
    id?: string;
    nombre: string;
    regionId: string;
}

export interface Local {
    id?: string;
    nombre?: string;
    descripcion: string;
    direccion: string;
    tipo: string;
    cod_postal: string;
    capacidad?: number;
    precio_hora: number;
    hora_apertura?: string;
    hora_cierre?: string;
    comuna_id: string;
    activo: boolean;
    imagenes?: string[];
    documentos?: string[];
    comuna?: Comuna;
    propietarios?: Usuario[];
    valoraciones?: Valoracion[];
}

interface Valoracion {
    id?: string;
    fecha: string;
    puntaje: number;
    comentario?: string;
    cliente_id?: string;
    propiedad_id?: string;
}

export interface Usuario{
    id?: string;
    email: string;
    rut: string;
    nombres: string;
    appaterno: string;
    apmaterno: string;
    fecha_nacimiento: Date;
    password?: string; 
    tipo?: 'cliente' | 'propietario' | 'admin';
    fecha_creacion?: Date;
}

export interface Reserva {
    id?: string;
    inicio: Date;
    fin: Date;
    cant_horas: number;
    estado: 'pendiente' | 'confirmada' | 'cancelada';
    cliente: Usuario;
    propiedad: Local;
    fecha_creacion: Date;
}