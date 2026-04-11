import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export default function ImagesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Imágenes de Productos"/>
            <TableModal />    
        </div>
    )
}