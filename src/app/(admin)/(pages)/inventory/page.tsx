import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Inventory | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Inventory page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function InventoryPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Inventory" />
            <div className="space-y-6">
                <ComponentCard title="Inventory Table">
                    <BasicTableOne />
                </ComponentCard>
            </div>
        </div>
    )
}