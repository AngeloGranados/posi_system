import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import TableModal from "./(components-ui)/tableModal";
import { Product } from "@/types/produts";

export const metadata: Metadata = {
    title: "Next.js Products | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Products page for TailAdmin  Tailwind CSS Admin Dashboard Template"
}

export default function ProductsPage() {

    const products: Product[] = [
        {
            id: 1,
            name: "Product 1",
            slug: "product-1",
            description_short: "Short description of product 1",
            description_long: "Long description of product 1",
            price: 19.99,
            category_id: 1,
            idbrand: 1,
            rating: 4.5,
            reviews: 10,
            stock: 100,
            image: "https://via.placeholder.com/200",
            is_active: true,
            created_at: "2023-01-01T00:00:00Z",
            updated_at: "2023-01-01T00:00:00Z"
        },
        {
            id: 2,
            name: "Product 2",
            slug: "product-2",
            description_short: "Short description of product 2",
            description_long: "Long description of product 2",
            price: 29.99,
            category_id: 2,
            idbrand: 2,
            rating: 4.0,
            reviews: 5,
            stock: 50,
            image: "https://via.placeholder.com/200",
            is_active: true,
            created_at: "2023-01-02T00:00:00Z",
            updated_at: "2023-01-02T00:00:00Z"
        }
    ]

    return (
        <div>
            <PageBreadcrumb pageTitle="Products" />
            <TableModal products={products} />    
        </div>
    )
}