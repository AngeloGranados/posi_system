import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export default function ShippingMethodsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Métodos de Envío" />
            <TableModal />    
        </div>
    )
}