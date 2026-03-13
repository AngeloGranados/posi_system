import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export const metadata: Metadata = {
    title: "Next.js Attributes | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Attributes page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function AttributesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Atributos" />
            <TableModal />    
        </div>
    )
}