import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export default async function ProductsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Productos" />
            <TableModal />    
        </div>
    )
}