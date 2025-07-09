export interface Region {
    id?: string;
    nombre: string;
}

export interface Comuna {
    id?: string;
    nombre: string;
    region_id: string;
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
    validada: boolean;
    activo: boolean;
    imagenes?: string[];
    documento?: string;
    comuna?: Comuna;
    propietarios?: Usuario[];
    valoraciones?: Valoracion[];
}

export interface Valoracion {
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

export interface BloqueoUsuario {
    id?: string;
    motivo: string;
    fecha_bloqueo: Date;
    fecha_desbloqueo: Date;
    usuario_id: string;
    administrador_id: string;
}

export interface Reserva {
    id?: string;
    inicio: Date;
    fin: Date;
    cant_horas: number;
    estado: 'pendiente' | 'completada' | 'cancelada';
    costo_pagado?: number;
    costo_total?: number;
    fecha_creacion?: Date;
    cliente_id: string;
    propiedad_id: string;
}