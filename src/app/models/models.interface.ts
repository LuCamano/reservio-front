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