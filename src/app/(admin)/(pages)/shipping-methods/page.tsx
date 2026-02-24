import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Shipping Methods | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Shipping Methods page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function ShippingMethodsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Shipping Methods" />
            <div className="space-y-6">
                <ComponentCard title="Shipping Methods Table">
                    <BasicTableOne />
                </ComponentCard>
            </div>
        </div>
    )
}