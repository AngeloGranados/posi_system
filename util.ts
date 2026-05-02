import { statusOrders } from "@/types/orders";
import { DEFAULT_CONFIG } from "./config";

export function formatPrice(price: number | string): string {
    if (typeof price === 'string') {
        price = parseFloat(price);
    }
    return new Intl.NumberFormat('es-PE', { style : 'currency', currency: 'PEN' }).format(price);
}

export function formatTelephone(phone: string): string {
    if (!phone) return "";
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length === 9) {
        return `+51 ${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6)}`;
    }
    return phone;
}

type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";
export function verifyColorByStatus(status: statusOrders): BadgeColor {
    return (
        status === 'pending' ? 'warning' : 
        status === "delivered" ? 'success' : 
        status === "cancelled" ? 'error' : 
        status === "processing" ? 'info' : 
        status === "shipped" ? 'success' : 
        'light'
    )
}

export function formatDate(dateString: string): string {
    const data = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return data.toLocaleDateString('es-PE', options);
}

export function getNowDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function calculateIzipayAmount(amount: number | string): number {
    const comission = DEFAULT_CONFIG.izipayConfig.COMISSION_RATE_IZIPAY;
    const IGV = DEFAULT_CONFIG.moneyConfig.IGV;
    const cargoFijo = DEFAULT_CONFIG.izipayConfig.CARGO_FIJO;
    
    if (typeof amount === 'string') {
        amount = parseFloat(amount);
        if (isNaN(amount)) {
            throw new Error("El monto debe ser un número válido");
        }
    }
    if (amount <= 0) throw new Error("El monto debe ser mayor a cero");

    const effectiveRate = comission * (1 + IGV);
    const effectiveFixed = cargoFijo * (1 + IGV);

    // Solo redondea a 2 decimales, NO a céntimos
    const total = (amount + effectiveFixed) / (1 - effectiveRate);

    // Redondea a 2 decimales para soles
    const totalRounded = Math.ceil(total * 100) / 100;

    return totalRounded;
}

export function calculateYapeAmount(amount: number | string): number {
    const comission = DEFAULT_CONFIG.yapeConfig.COMISSION_RATE_YAPE;
    const cargoFijo = DEFAULT_CONFIG.yapeConfig.CARGO_FIJO;
    
    if (typeof amount === 'string') {
        amount = parseFloat(amount);
    }
    if (isNaN(amount)) {
        throw new Error("El monto debe ser un número válido");
    }
    if (amount <= 0) throw new Error("El monto debe ser mayor a cero");

    const subTotal = (amount + cargoFijo) / (1 - comission);

    const totalRounded = Math.ceil(subTotal * 100) / 100;

    return totalRounded;
}
