'use client'
import { useModal } from "@/hooks/useModal"
import { Product } from "@/types/produts"
import ModalProduct from "./modalProducts";
import TableProducts from "./tableProducts";
import { useState } from "react";
import { createProduct } from "@/services/produtsServices";

interface TableModalProps {
    initialProducts: Product[];
}

export default function TableModal({ initialProducts }: TableModalProps) {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productsList, setProductsList] = useState<Product[]>(initialProducts);

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

            if (field === "image"){
                if (!(product[field] instanceof File) || product[field].size === 0){
                    error = `El campo ${field} es obligatorio.`;
                    break;
                }
            }
        }

        if (error) {
            console.error("Validation error:", error);
            return;
        }

        try {
            const result = await createProduct(product, images);
            setProductsList(prev => [...prev, result]);
            closeModal();
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }

    const handleOpenModal = (product: Product | null) => {
        setSelectedProduct(product);
        openModal();
    };

    return (
        <>
            <ModalProduct isOpen={isOpen} closeModal={closeModal} setSelected={setSelectedProduct} handleCreateProduct={handleCreateProduct} selected={selectedProduct} />
            <TableProducts data={productsList} OpenModal={handleOpenModal} />
        </>
    );
}