export interface preferenciaPagoResponse {
    success: boolean;
    data: Data;
    message: string;
}

interface Data {
    pago_id: string;
    preference_id: string;
    init_point: string;
    sandbox_init_point: string;
}

export interface Pago {
    success: boolean;
    data: Datum[];
    total_pendiente: number;
}

export interface Datum {
    id: string;
    monto: number;
    estado: string;
    fecha_creacion: Date;
    descripcion: string;
}