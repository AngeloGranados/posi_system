import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export const metadata: Metadata = {
    title: "Next.js Brands | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Brands page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function BrandsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Marcas" />
            <div className="space-y-6">
                <TableModal/>
            </div>
        </div>
    )
}