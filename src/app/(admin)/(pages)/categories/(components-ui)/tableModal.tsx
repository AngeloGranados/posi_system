'use client'

import { useModal } from "@/hooks/useModal"
import { useCallback, useEffect, useState } from "react";
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
import debounce from "debounce";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
    const [categoriesList, setCategoriesList] = useState<Categories[]>([]);
    const [isPrincipal, setIsPrincipal] = useState<boolean>(false);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(100)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByCategories>("ByASC")
    const [orderField, setOrderField] = useState<orderByAscDescCategories>("id")
    const [filterlike, setFilterlike] = useState('')
    const [inputSearch, setInputSearch] = useState('')

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()
    const [ errorInput, setErrorInput ] = useState<string | null>(null)

    const tableThCategories: tableThCategories[] = [
        { name: "id", value: "ID" },
        { name: "name", value: "Nombre" },
        { name: "description", value: "Descripción" },
        { name: "parent_id", value: "Tipo" },
        { name: "actions", value: "Acciones" }
    ]

    async function fetchCategoriesFiltered() {
        setLoading(true);
        try {
            const response = await getCategoriesFiltered({orderBy, orderField, limit, page, filterlike});
            setCategoriesList(response.data);
            setPageTotal(response.totalRows);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoriesFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    const pageTotalToTable = Math.ceil(pageTotal / limit);

    async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>, category: Categories) {
        event.preventDefault();

        let error = null;
        let fieldError = null;

        const requiredFields: (keyof Categories)[] = ["name", "slug", "description", "image_url"];

        for (const field of requiredFields) {
            if (!category[field] || (category[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
                fieldError = field;
                break;
            }

            if (field === "image_url" && selectedCategory === null) {
                if (!(category[field] instanceof File) || category[field].size === 0) {
                    error = `El campo ${field} es obligatorio.`;
                    fieldError = field;
                    break;
                }
            }
        }

        if (!isPrincipal) {
            if (!category.parent_id) {
                error = "Debe seleccionar una categoría principal.";
                fieldError = "parent_id";
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            setErrorInput(fieldError);
            return;
        }

        try {
            setLoading(true);
            if (selectedCategory) {
                await updateCategory(category);

            } else {
                await createCategory(category);
            }

            await fetchCategoriesFiltered();
            closeModal();
        } catch (error) {
            triggerAlert("Error", error instanceof Error ? error.message : "Error desconocido", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteCategory(categoryId: string) {
        try{ 
            await deleteCategory(categoryId);
            await fetchCategoriesFiltered();
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

    const debounceOnchangeFilterLike = useCallback(debounce((value: string) => {
        setFilterlike(value);
    }, 500), []);

    const handleOnchangeFilterLike = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
        debounceOnchangeFilterLike(e.target.value);
    }

    return (
        <>
            <ModalCategory 
                errorInput={errorInput}
                setErrorInput={setErrorInput}
                loading={loading}
                setIsPrincipal={setIsPrincipal}
                isPrincipal={isPrincipal}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedCategory} 
                handleCreateCategory={handleCreateCategory} 
                selected={selectedCategory} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<Categories>
                search={inputSearch}
                setSearch={handleOnchangeFilterLike}
                titleTable=""
                buttonText="Agregar una Categoría"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThCategories} 
                OpenModal={handleOpenModal}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                showSearch={true}
                page={page}
                setPage={setPage}
            >
                {
                    loading ? (
                        <TableRow>
                            <TableCell className="text-center py-4" colSpan={12}>   
                                <div className="w-full h-50">
                                    <Skeleton width={'100%'} height={'100%'} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
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
                                    <TableCell className="px-5 my-4 text-gray-700">
                                        {
                                        category.parent_id ? 
                                        <span className="text-gray-500">Subcategoria de {category.parent_name}</span> 
                                        : <span className="text-gray-500">Categoria Padre</span>
                                        }
                                    </TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(category)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleDeleteCategory(category.id as string)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="text-center py-4" colSpan={12}>
                                    No hay categorías disponibles
                                </TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}