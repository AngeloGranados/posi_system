import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Promotion Codes | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Promotion Codes page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function PromotionCodesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Promotion Codes" />
            <div className="space-y-6">
                <ComponentCard title="Promotion Codes Table">
                    <BasicTableOne />
                </ComponentCard>
            </div>
        </div>
    )
}