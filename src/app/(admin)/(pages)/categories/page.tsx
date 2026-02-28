import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export const metadata: Metadata = {
    title: "Next.js Categorias | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Categorias page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default async function CategoriesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Categorias" />
            <TableModal />    
        </div>
    )
}