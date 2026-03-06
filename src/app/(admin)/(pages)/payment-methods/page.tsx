import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export const metadata: Metadata = {
    title: "Next.js Payment Methods | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Payment Methods page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function PaymentMethodsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Métodos de Pago" />
            <TableModal />    
        </div>
    )
}