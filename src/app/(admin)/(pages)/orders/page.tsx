import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Orders | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Orders page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function OrdersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Orders" />
            <div className="space-y-6">
                <ComponentCard title="Orders Table">
                    <BasicTableOne />
                </ComponentCard>
            </div>
        </div>
    )
}