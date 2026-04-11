import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export default function PaymentMethodsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Métodos de Pago" />
            <TableModal />    
        </div>
    )
}