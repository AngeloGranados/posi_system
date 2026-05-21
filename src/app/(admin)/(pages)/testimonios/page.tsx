import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";

export default function TestimoniosPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Testimonios" />
            <TableModal />    
        </div>
    )
}