import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export const metadata: Metadata = {
    title: "Next.js Orders | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Orders page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function OrdersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Orders" />
            <TableModal />
        </div>
    )
}