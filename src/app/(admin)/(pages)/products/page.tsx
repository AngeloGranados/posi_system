import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export const metadata: Metadata = {
    title: "Next.js Products | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Products page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default async function ProductsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Products" />
            <TableModal />    
        </div>
    )
}