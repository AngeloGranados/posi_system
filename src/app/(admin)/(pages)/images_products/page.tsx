import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export const metadata: Metadata = {
    title: "Next.js Images | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Images page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function ImagesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Imágenes de Productos"/>
            <TableModal />    
        </div>
    )
}