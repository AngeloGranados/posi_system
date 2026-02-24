import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Payment Methods | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Payment Methods page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function PaymentMethodsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Payment Methods" />
            <div className="space-y-6">
                <ComponentCard title="Payment Methods Table">
                    <BasicTableOne />
                </ComponentCard>
            </div>
        </div>
    )
}