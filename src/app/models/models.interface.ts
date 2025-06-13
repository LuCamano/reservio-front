export interface Region {
    id: string;
    nombre: string;
}

export interface Comuna {
    id: string;
    nombre: string;
    regionId: string;
}

export interface Local {
    id: string;
    nombre: string;
    region: string;
    comuna: string;
    capacidad: number;
    descripcion: string;
    precioH: number;
    direccion?: string;
    disponible: boolean;
    imagenUrl: string;
}

export interface Usuario{
    id: string;
    email: string;
    rut: string;
    nombres: string;
    appaterno: string;
    apmaterno: string;
    fecha_nacimiento: Date;
    password?: string; 
    tipo: string;
    fecha_creacion: Date;
    activo: boolean;
}

export interface Reserva {
    id: string;
    inicio: Date;
    fin: Date;
    cant_horas: number;
    estado: 'pendiente' | 'confirmada' | 'cancelada';
    cliente: Usuario;
    propiedad: Local;
    fecha_creacion: Date;
}