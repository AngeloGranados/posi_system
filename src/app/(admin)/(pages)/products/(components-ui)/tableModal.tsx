'use client'
import { useModal } from "@/hooks/useModal"
import { Product } from "@/types/produts"
import ModalProduct from "./modalProducts";
import TableProducts from "./tableProducts";
import { useState } from "react";

interface TableModalProps {
    products: Product[];
}

export default function TableModal({ products }: TableModalProps) {

    const { isOpen, closeModal, openModal } = useModal()
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const handleOpenModal = (product: Product | null) => {
        setSelectedProduct(product);
        openModal();
    }

    return (
        <>
            <ModalProduct isOpen={isOpen} closeModal={closeModal} selected={selectedProduct} />
            <TableProducts data={products} OpenModal={handleOpenModal} />
        </>
    )
}