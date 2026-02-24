import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js Categories | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Categories page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function CategoriesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Categories" />
            <div className="space-y-6">
                <ComponentCard title="Categories Table">
                    <BasicTableOne />
                </ComponentCard>
            </div>
        </div>
    )
}