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
import ModalPromoCodes from "./modalPromoCodes";
import { orderByAscDescPromoCodes, orderByPromoCodes, PromoCodes, tableThPromoCodes } from "@/types/promoCodes";
import { createPromoCodes, deletePromoCodes, getPromoCodesFiltered, updatePromoCodes } from "@/services/promoCodesServices";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedPromoCodes, setSelectedPromoCodes] = useState<PromoCodes | null>(null);
    const [promoCodesList, setPromoCodesList] = useState<PromoCodes[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByPromoCodes>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescPromoCodes>("id")
    const [filterlike, setFilterlike] = useState('')

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()

    const tableThPromoCodes: tableThPromoCodes[] = [
        { name: "id", value: "ID" },
        { name: "code", value: "Código" },
        { name: "description", value: "Descripción" },
        { name: "discount_type", value: "Tipo de Descuento" },
        { name: "min_purchase", value: "Mínimo de Compra" },
        { name: "max_discount", value: "Máximo de Descuento" },
        { name: "usage_limit", value: "Límite de Uso" },
        { name: "valid_from", value: "Válido Desde" },
        { name: "is_active", value: "Estado" }, 
        { name: "actions", value: "Acciones" }
    ]

    async function fetchPromoCodesFiltered() {
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getPromoCodesFiltered({orderBy, orderField, limit, page});
            setPromoCodesList(response.data);
            setPageTotal(response.totalRows); // Actualiza el total de elementos
        }catch (error) {
            console.error("Error fetching promoCodes:", error);
        }
    }

    useEffect(() => {
        fetchPromoCodesFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    // El total de páginas debe ser calculado con el total de elementos
    const pageTotalToTable = Math.max(1, Math.ceil(pageTotal / limit));

    async function handleCreatePromoCodes(event: React.FormEvent<HTMLFormElement>, promoCodes: PromoCodes) {
        event.preventDefault();

        let error = null;

        const requiredFields: (keyof PromoCodes)[] = ["code", "description", "discount_type", "min_purchase", "max_discount", "usage_limit", "valid_from", "valid_until"];

        for (const field of requiredFields) {
            if (!promoCodes[field] || (promoCodes[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
                break;
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            return;
        }

        try {
            if (selectedPromoCodes) {
                await updatePromoCodes(promoCodes);
            } else {
                await createPromoCodes(promoCodes);
            }

            await fetchPromoCodesFiltered();
            closeModal();
        } catch (error) {
            console.error("Error creating promoCodes:", error);
        }
    }

    async function handleDeletePromoCodes(promoCodesId: number) {
        try{ 
            await deletePromoCodes(promoCodesId);
            await fetchPromoCodesFiltered();
        }catch(error){
            console.error("Error deleting promoCodes:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDescPromoCodes) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: PromoCodes | null) => {
        setSelectedPromoCodes(data);
        openModal();
    };

    return (
        <>
            <ModalPromoCodes 
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedPromoCodes} 
                handleCreatePromoCodes={handleCreatePromoCodes} 
                selected={selectedPromoCodes} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<PromoCodes>
                titleTable="Métodos de Envío"
                buttonText="Agregar un Método de Envío"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThPromoCodes} 
                OpenModal={handleOpenModal}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                page={page}
                setPage={setPage}
            >
                {
                    promoCodesList && promoCodesList.length > 0 ? (
                        promoCodesList.map((promoCodes) => (
                            <TableRow key={promoCodes.id}>
                                <TableCell className="px-3 py-3 text-left">#{promoCodes.id}</TableCell>
                                <TableCell className="px-3 py-3 text-left">
                                    <span className="text-gray-500">{promoCodes.code}</span>
                                </TableCell>
                                <TableCell className="px-3 py-3 text-left">{promoCodes.description}</TableCell>
                                <TableCell className="px-3 py-3 text-left">
                                    {promoCodes.discount_type === "percentage" ? `${promoCodes.discount_value}%` : `$${promoCodes.discount_value}`}
                                </TableCell>
                                <TableCell className="px-3 py-3 text-left">{promoCodes.min_purchase}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{promoCodes.max_discount}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{promoCodes.usage_limit}</TableCell>
                                <TableCell className="px-3 py-3 text-left">
                                    <div>
                                        <span>{promoCodes.valid_from ? promoCodes.valid_from.toString() : "No Date"}</span>
                                        <span className="mx-1">-</span>
                                        <span>{promoCodes.valid_until ? promoCodes.valid_until.toString() : "No Date"}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-3 py-3 text-left">{promoCodes.is_active ? "Active" : "Inactive"}</TableCell>
                                <TableCell className="px-3 py-3">
                                    <div className="flex space-x-4">
                                        <Button onClick={() => handleOpenModal(promoCodes)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                        <Button onClick={() => handleDeletePromoCodes(promoCodes.id as number)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
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