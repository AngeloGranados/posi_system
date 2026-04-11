import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export default function AttributesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Atributos" />
            <TableModal />    
        </div>
    )
}