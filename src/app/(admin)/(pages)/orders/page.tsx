import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableModal from "./(components-ui)/tableModal";

export default function OrdersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Orders" />
            <TableModal />
        </div>
    )
}