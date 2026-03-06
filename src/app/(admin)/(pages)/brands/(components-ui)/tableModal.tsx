'use client'

import { useModal } from "@/hooks/useModal"
import { useEffect, useState } from "react";
import useAlert from "@/hooks/useAlert";
import TablePage from "@/components/tables/TablePage";
import { TableRow, TableCell } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import EditIcon from "../../../../../../public/images/icons/edit-icon";
import Button from "@/components/ui/button/Button";
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";
import ModalBrands from "./modalBrands";
import { Brands, orderByAscDescBrands, orderByBrands, tableThBrands } from "@/types/brands";
import { createBrands, deleteBrands, getBrandsFiltered, updateBrands } from "@/services/brandsServices";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedBrands, setSelectedBrands] = useState<Brands | null>(null);
    const [brandsList, setBrandsList] = useState<Brands[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByBrands>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescBrands>("id")
    const [filterlike, setFilterlike] = useState('')

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()

    const tableThBrands: tableThBrands[] = [
        { name: "id", value: "ID" },
        { name: "name", value: "Nombre" },
        { name: "slug", value: "Slug" },
        { name: "actions", value: "Acciones" }
    ]

    useEffect(() => {
        fetchBrandsFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    async function fetchBrandsFiltered() {
        setLoading(true);
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getBrandsFiltered({orderBy, orderField, limit, page});
            setBrandsList(response.data);
            setPageTotal(response.totalRows);
        } catch (error) {
            console.error("Error fetching brands:", error);
        } finally {
            setLoading(false);
        }
    }

    // El total de páginas debe ser calculado con el total de elementos
    const pageTotalToTable = Math.max(1, Math.ceil(pageTotal / limit));

    async function handleCreateBrands(event: React.FormEvent<HTMLFormElement>, brands: Brands) {
        event.preventDefault();

        let error = null;

        const requiredFields: (keyof Brands)[] = ["name", "slug" ];

        for (const field of requiredFields) {
            if (!brands[field] || (brands[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
                break;
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            return;
        }

        try {
            if (selectedBrands) {
                await updateBrands(brands);
            } else {
                await createBrands(brands);
            }

            await fetchBrandsFiltered();
            closeModal();
        } catch (error) {
            console.error("Error creating brands:", error);
        }
    }

    async function handleDeleteBrands(brandsId: number) {
        try{ 
            await deleteBrands(brandsId);
            await fetchBrandsFiltered();
        }catch(error){
            console.error("Error deleting brands:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDescBrands) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: Brands | null) => {
        setSelectedBrands(data);
        openModal();
    };

    return (
        <>
            <ModalBrands 
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedBrands} 
                handleCreateBrands={handleCreateBrands} 
                selected={selectedBrands} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<Brands>
                titleTable=""
                buttonText="Agregar una Marca"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThBrands} 
                OpenModal={handleOpenModal}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
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

                        brandsList && brandsList.length > 0 ? (
                            brandsList.map((brands) => (
                                <TableRow key={brands.id}>
                                    <TableCell className="px-3 py-3 text-left">#{brands.id}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{brands.name}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{brands.slug}</TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(brands)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleDeleteBrands(brands.id as number)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="text-center py-4" colSpan={12}>No se encontraron marcas.</TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}