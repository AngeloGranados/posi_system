import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export const metadata: Metadata = {
    title: "Next.js Shipping Methods | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Shipping Methods page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function ShippingMethodsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Métodos de Envío" />
            <TableModal />    
        </div>
    )
}