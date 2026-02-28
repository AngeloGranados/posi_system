'use client'

import { useModal } from "@/hooks/useModal"
import { orderBy, orderByAscDesc, Product, tableThProducts } from "@/types/produts"
import ModalProduct from "./modalProducts";
import TableProducts from "./tableProducts";
import { useEffect, useState } from "react";
import { createProduct, deleteProduct, getProductsFilter, updateProduct } from "@/services/produtsServices";
import useAlert from "@/hooks/useAlert";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productsList, setProductsList] = useState<Product[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderBy | null>("ByASC")
    const [orderField, setOrderField] = useState<orderByAscDesc | null>("id")
    const [filterlike, setFilterlike] = useState('')

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()

    const tableThProducts: tableThProducts = [
        { name: "id", value: "ID" },
        { name: "name", value: "Producto" },
        { name: "price", value: "Precio" },
        { name: "stock", value: "Stock" },
        { name: "description_short", value: "Descripción" },
        { name: "is_active", value: "Estado" },
        { name: "actions", value: "Acciones" },
    ]

    useEffect(() => {
        async function fetchProductsFiltered() {
            try {
                const response = await getProductsFilter({ orderBy, orderField, limit, page });
                setProductsList(response.products);
                setPageTotal(response.total);
            }catch (error) {
                console.error("Error fetching products:", error);
            }
        }

        fetchProductsFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    const pageTotalToTable = Math.ceil(pageTotal / limit);

    async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>, product: Product, images: File[]) {
        event.preventDefault();

        let error = null;

        const requiredFields: (keyof Product)[] = ["name", "slug", "description_short", "description_long", "price", "category_id", "idbrand", "stock", "image"];

        for (const field of requiredFields) {
            if (field !== "stock" && field !== "discount") {
                if (!product[field] || (product[field] as string).toString().trim() === "") {
                    error = `El campo ${field} es obligatorio.`;
                    break;
                }
            }

            if (field === "price" && product[field] <= 0) {
                error = `El campo ${field} debe ser un número positivo.`;
                break;
            }

            if (field === "image" && selectedProduct === null) {
                if (!(product[field] instanceof File) || product[field].size === 0) {
                    error = `El campo ${field} es obligatorio.`;
                    break;
                }
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            return;
        }

        try {

            if (selectedProduct) {
                const result = await updateProduct(product);
                setProductsList(prev => prev.map(p => (p.id === result.id ? result : p)));
            } else {
                const result = await createProduct(product, images);
                setProductsList(prev => [...prev, result]);
            }
            closeModal();
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }

    async function handleDeleteProduct(productId: number) {
        try{ 
            await deleteProduct(productId);
            setProductsList(prev => prev.filter(p => p.id !== productId));
        }catch(error){
            console.error("Error deleting product:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDesc) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (product: Product | null) => {
        setSelectedProduct(product);
        openModal();
    };

    return (
        <>
            <ModalProduct 
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedProduct} 
                handleCreateProduct={handleCreateProduct} 
                selected={selectedProduct} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TableProducts 
                data={productsList} 
                orderField={orderField} 
                orderBy={orderBy} 
                tableThProducts={tableThProducts} 
                OpenModal={handleOpenModal} 
                handleDeleteProduct={handleDeleteProduct} 
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                page={page}
                setPage={setPage}
            />
        </>
    );
}