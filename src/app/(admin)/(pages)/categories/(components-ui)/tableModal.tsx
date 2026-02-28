'use client'

import { useModal } from "@/hooks/useModal"
import { useEffect, useState } from "react";
import useAlert from "@/hooks/useAlert";
import TablePage from "@/components/tables/TablePage";
import { TableRow, TableCell } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import { formatPrice } from "../../../../../../util";
import Badge from "@/components/ui/badge/Badge";
import EditIcon from "../../../../../../public/images/icons/edit-icon";
import Button from "@/components/ui/button/Button";
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";
import { createCategory, deleteCategory, getCategoriesFiltered, updateCategory } from "@/services/categoriesServices";
import { Categories, orderByAscDescCategories, orderByCategories, tableThCategories } from "@/types/categories";
import ModalCategory from "./modalCategory";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
    const [categoriesList, setCategoriesList] = useState<Categories[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByCategories>("ByASC")
    const [orderField, setOrderField] = useState<orderByAscDescCategories>("id")
    const [filterlike, setFilterlike] = useState('')

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()

    const tableThCategories: tableThCategories[] = [
        { name: "id", value: "ID" },
        { name: "name", value: "Nombre" },
        { name: "description", value: "Descripción" },
        { name: "actions", value: "Acciones" }
    ]

    useEffect(() => {
        async function fetchCategoriesFiltered() {
            try {
                const response = await getCategoriesFiltered({orderBy, orderField, limit, page});// Agrega este log para verificar la respuesta
                setCategoriesList(response);
            }catch (error) {
                console.error("Error fetching categories:", error);
            }
        }

        fetchCategoriesFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    const pageTotalToTable = Math.ceil(pageTotal / limit);

    async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>, category: Categories) {
        event.preventDefault();

        let error = null;

        const requiredFields: (keyof Categories)[] = ["name", "slug", "description", "image_url"];

        for (const field of requiredFields) {
            if (!category[field] || (category[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
                break;
            }

            if (field === "image_url" && selectedCategory === null) {
                if (!(category[field] instanceof File) || category[field].size === 0) {
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
            if (selectedCategory) {
                const result = await updateCategory(category);
                console.log("Category updated:", result);
                setCategoriesList(prev => prev.map(c => (c.id === result.id ? result : c)));
            } else {
                const result = await createCategory(category);        
                setCategoriesList(prev => [...prev, result]);
            }
            closeModal();
        } catch (error) {
            console.error("Error creating category:", error);
        }
    }

    async function handleDeleteCategory(categoryId: number) {
        try{ 
            await deleteCategory(categoryId);
            setCategoriesList(prev => prev.filter(c => c.id !== categoryId));
        }catch(error){
            console.error("Error deleting category:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDescCategories) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: Categories | null) => {
        setSelectedCategory(data);
        openModal();
    };

    return (
        <>
            <ModalCategory 
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedCategory} 
                handleCreateCategory={handleCreateCategory} 
                selected={selectedCategory} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<Categories>
                titleTable="Categorías"
                buttonText="Agregar una Categoría"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThCategories} 
                OpenModal={handleOpenModal}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                page={page}
                setPage={setPage}
            >
                {
                    categoriesList && categoriesList.length > 0 ? (
                        categoriesList.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="px-3 py-3 text-left">#{category.id}</TableCell>
                                <TableCell className="px-3 py-3 text-left">
                                    <div className="flex items-center space-x-4">
                                        <div className="mb-2">
                                            {
                                                category.image_url && (
                                                <Image
                                                    width={64}
                                                    height={64}
                                                    unoptimized={process.env.NODE_ENV ? true : false}
                                                    src={`${process.env.NEXT_PUBLIC_URL_IMAGES ?? ""}${typeof category.image_url === "string" ? category.image_url : category.image_url}`}
                                                    alt={category.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                )
                                            }
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-bold">{category.name}</span>
                                            <small className="text-gray-500">{category.slug}</small>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 my-4 line-clamp text-gray-700">{category.description}</TableCell>
                                <TableCell className="px-3 py-3">
                                    <div className="flex space-x-4">
                                        <Button onClick={() => handleOpenModal(category)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                        <Button onClick={() => handleDeleteCategory(category.id as number)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell className="text-center py-4" colSpan={12}>   
                                <div className="w-full h-50">
                                    <Skeleton width={'100%'} height={'100%'} />
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                }
            </TablePage>
        </>
    );
}