import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export default async function CategoriesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Categorias" />
            <TableModal />    
        </div>
    )
}