import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Addresses | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Addresses page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function AddressesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Addresses" />
            <div className="space-y-6">
                <ComponentCard title="Addresses Table">
                    <BasicTableOne />
                </ComponentCard>
            </div>
        </div>
    )
}