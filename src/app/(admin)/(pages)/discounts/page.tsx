import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export const metadata: Metadata = {
    title: "Next.js Discounts | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Discounts page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function DiscountsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Descuentos de Productos"/>
            <TableModal />    
        </div>
    )
}