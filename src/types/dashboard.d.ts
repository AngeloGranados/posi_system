
type namesCardsTotalRegisters = "Productos" | "Usuarios" | "Ordenes" | "Marcas" | "Categorias" | "Metodos de Pago" | "Metodos de Envio";
type CardsTotalRegisters = [{ count: number, nameCard: namesCardsTotalRegisters }]
interface CompanyData {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyLogo: File;
    companyAddress: string;
    socials: Record<RedSocial, string>;
}