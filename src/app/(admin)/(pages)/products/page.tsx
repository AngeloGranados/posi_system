import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";
import { Product } from "@/types/produts";
import { getProducts } from "@/services/produtsServices";

export const metadata: Metadata = {
    title: "Next.js Products | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Products page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default async function ProductsPage() {

    const products: Product[] = await getProducts() 

    return (
        <div>
            <PageBreadcrumb pageTitle="Products" />
            <TableModal initialProducts={products} />    
        </div>
    )
}