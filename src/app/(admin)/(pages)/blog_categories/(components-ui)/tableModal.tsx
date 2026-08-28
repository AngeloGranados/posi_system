'use client'

import { useModal } from "@/hooks/useModal"
import { useCallback, useEffect, useState } from "react";
import useAlert from "@/hooks/useAlert";
import TablePage from "@/components/tables/TablePage";
import { TableRow, TableCell } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import EditIcon from "../../../../../../public/images/icons/edit-icon";
import Button from "@/components/ui/button/Button";
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";
import debounce from "debounce";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { createBlogCategory, deleteBlogCategory, getBlogCategoriesFiltered, updateBlogCategory } from "@/services/BlogCategoriesServices";
import ModalBlogCategories from "./modalCategory";
import { BlogCategories, filterOptions, orderByAscDescBlogCategories, tableThBlogCategories } from "@/types/BlogCategories";

const SweetAlert = withReactContent(Swal);

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedBlogCategories, setSelectedBlogCategories] = useState<BlogCategories | null>(null);
    const [BlogCategoriesList, setBlogCategoriesList] = useState<BlogCategories[]>([]);
    const [isPrincipal, setIsPrincipal] = useState<boolean>(false);

    // filters
    const [filters, setFilters] = useState<filterOptions>({
        orderField: "id",
        orderBy: "ByASC",
        filterlike: '',
        limit: 100,
        page: 1,
        parent_id: '',
        typeBlogCategories: null
    })
    
    const [inputSearch, setInputSearch] = useState('')
    const [pageTotal, setPageTotal] = useState(1)
    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()
    const [ errorInput, setErrorInput ] = useState<string | null>(null)

    const tableThBlogCategories: tableThBlogCategories[] = [
        { name: "id", value: "ID" },
        { name: "name", value: "Nombre" },
        { name: "description", value: "Descripción" },
        { name: "created_at", value: "Fecha de Creación" },
        { name: "actions", value: "Acciones" }
    ]

    async function fetchBlogCategoriesFiltered() {
        setLoading(true);
        try {
            const response = await getBlogCategoriesFiltered(filters);
            setBlogCategoriesList(response.data);
            setPageTotal(response.totalRows);
        } catch (error) {
            console.error("Error fetching BlogCategories:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBlogCategoriesFiltered()
    }, [filters]);

    const pageTotalToTable = Math.ceil(pageTotal / filters.limit);

    async function handleCreateBlogCategories(event: React.FormEvent<HTMLFormElement>, BlogCategories: BlogCategories) {
        event.preventDefault();

        let error = null;
        let fieldError = null;

        const requiredFields: (keyof BlogCategories)[] = ["name", "slug", "description"];

        for (const field of requiredFields) {
            if (!BlogCategories[field] || (BlogCategories[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
                fieldError = field;
                break;
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            setErrorInput(fieldError);
            return;
        }

        try {
            setLoading(true);
            if (selectedBlogCategories) {
                await updateBlogCategory(BlogCategories);

            } else {
                await createBlogCategory(BlogCategories);
            }

            await fetchBlogCategoriesFiltered();
            closeAlert();
            closeModal();
        } catch (error) {
            triggerAlert("Error", error instanceof Error ? error.message : "Error desconocido", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteBlogCategories(BlogCategoriesId: string) {

        SweetAlert.fire({
            title: "¿Estás seguro?",
            text: "Este registro sera eliminado permanentemente y podria borrar toda la información relacionada a este.",
            icon: "warning",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteBlogCategory(BlogCategoriesId);
                    SweetAlert.fire("¡Eliminado!", "La categoría ha sido eliminada.", "success");
                    await fetchBlogCategoriesFiltered();
                }catch(error){
                    console.error("Error deleting BlogCategories:", error);
                }
            }
        })
    } 

    async function handleOrderByAscDesc(field: orderByAscDescBlogCategories) {
        if(filters.orderField === field){
            setFilters((prev) => ({ ...prev, orderBy: prev.orderBy === "ByASC" ? "ByDESC" : "ByASC" }));
        } else {
            setFilters((prev) => ({ ...prev, orderField: field, orderBy: "ByASC" }));
        }
    }

    const handleOpenModal = (data: BlogCategories | null) => {
        setSelectedBlogCategories(data);
        openModal();
    };

    const debounceOnchangeFilterLike = useCallback(debounce((value: string) => {
        setFilters((prev) => ({ ...prev, filterlike: value }));
    }, 500), []);

    const handleOnchangeFilterLike = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
        debounceOnchangeFilterLike(e.target.value);
    }

    return (
        <>
            <ModalBlogCategories 
                errorInput={errorInput}
                setErrorInput={setErrorInput}
                loading={loading}
                setIsPrincipal={setIsPrincipal}
                isPrincipal={isPrincipal}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedBlogCategories} 
                handleCreateBlogCategories={handleCreateBlogCategories}
                selected={selectedBlogCategories}
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<BlogCategories>
                search={inputSearch}
                setSearch={handleOnchangeFilterLike}
                titleTable=""
                buttonText="Agregar una Categoría"
                orderField={filters.orderField} 
                orderBy={filters.orderBy} 
                tableThPage={tableThBlogCategories} 
                OpenModal={handleOpenModal}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                showSearch={true}
                page={filters.page}
                setPage={(page) => setFilters((prev) => ({ ...prev, page }))}
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
                        BlogCategoriesList && BlogCategoriesList.length > 0 ? (
                            BlogCategoriesList.map((BlogCategories) => (
                                <TableRow key={BlogCategories.id}>
                                    <TableCell className="px-3 py-3 text-left">#{BlogCategories.id}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-bold">{BlogCategories.name}</span>
                                                <small className="text-gray-500">{BlogCategories.slug}</small>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 my-4 line-clamp text-gray-700">{BlogCategories.description}</TableCell>
                                    <TableCell className="px-5 my-4">{BlogCategories.created_at}</TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(BlogCategories)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleDeleteBlogCategories(BlogCategories.id as string)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
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