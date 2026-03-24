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
import Badge from "@/components/ui/badge/Badge";
import { formatDate } from "@fullcalendar/core/index.js";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedPromoCodes, setSelectedPromoCodes] = useState<PromoCodes | null>(null);
    const [promoCodesList, setPromoCodesList] = useState<PromoCodes[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(100)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByPromoCodes>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescPromoCodes>("id")
    const [filterlike, setFilterlike] = useState('')

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()
    const [ errorInput, setErrorInput ] = useState<string | null>(null)

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
        setLoading(true);
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getPromoCodesFiltered({orderBy, orderField, limit, page});
            setPromoCodesList(response.data);
            setPageTotal(response.totalRows); // Actualiza el total de elementos
        }catch (error) {
            console.error("Error fetching promoCodes:", error);
        } finally {
            setLoading(false);
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
        let fieldError = null;

        const requiredFields: (keyof PromoCodes)[] = ["code", "description", "discount_type", "min_purchase", "max_discount", "usage_limit", "valid_from", "valid_until"];

        for (const field of requiredFields) {
            if (!promoCodes[field] || (promoCodes[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
                fieldError = field;
                break;
            }

            if ((field === "discount_value" || field === "max_discount" || field === "min_purchase" || field === "usage_limit")
                && typeof promoCodes[field] === "number" && promoCodes[field] < 0
            ) {
                error = `El campo ${field} debe ser un número válido mayor o igual a 0.`;
                fieldError = field;
                break;
            }

            if (field === "valid_from" || field === "valid_until") {
                if (field === "valid_from" && new Date(promoCodes[field]) < new Date()) {
                    error = `El campo ${field} debe ser una fecha futura.`;
                    fieldError = field;
                    break;
                }

                if (field === "valid_until" && new Date(promoCodes[field]) < new Date(promoCodes.valid_from)) {
                    error = `El campo ${field} debe ser una fecha futura.`;
                    fieldError = field;
                    break;
                }
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            setErrorInput(fieldError);
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
            triggerAlert("Error", error instanceof Error ? error.message : "Error desconocido", "error");
        }
    }

    async function handleDeletePromoCodes(promoCodesId: string) {
        try{ 
            await deletePromoCodes(promoCodesId);
            await fetchPromoCodesFiltered();
        }catch(error){
            triggerAlert("Error", error instanceof Error ? error.message : "Error desconocido", "error");
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
                errorInput={errorInput}
                setErrorInput={setErrorInput}
                loading={loading}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedPromoCodes} 
                handleCreatePromoCodes={handleCreatePromoCodes} 
                selected={selectedPromoCodes} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<PromoCodes>
                titleTable=""
                buttonText="Agregar un Código Promocional"
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
                    loading ? (
                        <TableRow>
                            <TableCell className="text-center py-4" colSpan={12}>   
                                <div className="w-full h-50">
                                    <Skeleton width={'100%'} height={'100%'} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
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
                                            <span>{formatDate(promoCodes.valid_from) ? formatDate(promoCodes.valid_from) : "No Date"}</span>
                                            <span className="mx-1">-</span>
                                            <span>{formatDate(promoCodes.valid_until) ? formatDate(promoCodes.valid_until) : "No Date"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        {
                                            promoCodes.is_active ? 
                                            <Badge variant="solid" color="success">Activo</Badge> : 
                                            <Badge variant="solid" color="error">Inactivo</Badge>
                                        }
                                    </TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(promoCodes)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleDeletePromoCodes(promoCodes.id as string)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="text-center py-4" colSpan={12}>
                                    No hay códigos promocionales disponibles.
                                </TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}