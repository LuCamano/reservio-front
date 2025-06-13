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
    precioH: number;
    direccion?: string;
    disponible: boolean;
    imagenUrl: string;
}

export interface Usuario{
    id: string;
    email: string;
    rut: string;
    nombre: string;
    apaterno: string;
    amaterno: string;
    fechaNacimiento: Date;
    tipo: string; // 'Usuario Comun' | 'Propieterio' | 'Administrador'
    contraseña: string;
    fechacreacion: Date;
    activo: boolean;
}