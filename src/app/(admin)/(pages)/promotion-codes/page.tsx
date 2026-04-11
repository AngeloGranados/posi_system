import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export default function PromotionCodesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Códigos de Promoción"/>
            <TableModal />    
        </div>
    )
}