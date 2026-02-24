import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Brands | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Brands page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function BrandsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Brands" />
            <div className="space-y-6">
                <ComponentCard title="Brands Table">
                    <BasicTableOne />
                </ComponentCard>
            </div>
        </div>
    )
}