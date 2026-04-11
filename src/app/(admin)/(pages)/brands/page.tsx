import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

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