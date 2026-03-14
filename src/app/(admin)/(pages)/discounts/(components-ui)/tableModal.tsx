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
import { Discounts, orderByAscDescDiscounts, orderByDiscounts, tableThDiscounts } from "@/types/discounts";
import { createDiscounts, deleteDiscounts, getDiscountsFiltered, updateDiscounts } from "@/services/discountsServices";
import Badge from "@/components/ui/badge/Badge";
import { formatDate } from "@fullcalendar/core/index.js";
import { formatPrice } from "../../../../../../util";
import Image from "next/image";
import ModalDiscounts from "./modalDiscounts";


export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedDiscounts, setSelectedDiscounts] = useState<Discounts | null>(null);
    const [discountsList, setDiscountsList] = useState<Discounts[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByDiscounts>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescDiscounts>("id")
    const [filterlike, setFilterlike] = useState('')

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()
    const [ errorInput, setErrorInput ] = useState<string | null>(null)
    
    const tableThDiscounts: tableThDiscounts[] = [
        { name: "id", value: "ID" },
        { name: "product_id", value: "Producto" },
        { name: "discount_type", value: "Tipo de Descuento" },
        { name: "valid_from", value: "Válido Desde" },
        { name: "is_active", value: "Estado" }, 
        { name: "actions", value: "Acciones" }
    ]

    async function fetchDiscountsFiltered() {
        setLoading(true);
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getDiscountsFiltered({orderBy, orderField, limit, page});
            setDiscountsList(response.data);
            setPageTotal(response.totalRows); // Actualiza el total de elementos
        }catch (error) {
            console.error("Error fetching discounts:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDiscountsFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    // El total de páginas debe ser calculado con el total de elementos
    const pageTotalToTable = Math.max(1, Math.ceil(pageTotal / limit));

    async function handleCreateDiscounts(event: React.FormEvent<HTMLFormElement>, discounts: Discounts) {
        event.preventDefault();

        let error = null;
        let fieldError = null;

        const requiredFields: (keyof Discounts)[] = ["product_id", "discount_type", "discount_value", "valid_from", "valid_until"];

        for (const field of requiredFields) {
            if (!discounts[field] || (discounts[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
                fieldError = field;
                break;
            }

            if(field === "discount_value" && isNaN(Number(discounts.discount_value))){
                error = `El valor de descuento debe ser un numero`;
                fieldError = field;
                break;
            }

            if(field === "valid_from" || field === "valid_until") {
                discounts.valid_from = new Date(discounts.valid_from);
                discounts.valid_until = new Date(discounts.valid_until);

                if (field === "valid_from" && discounts.valid_from < new Date()){
                    error = `La fecha de inicio debe ser mayor a la fecha actual`;
                    fieldError = field;
                    break;
                }

                if (field === "valid_until" && discounts.valid_until <= discounts.valid_from){
                    error = `La fecha final debe ser mayor a la de inicio`;
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
            setLoading(true);
            if (selectedDiscounts) {
                await updateDiscounts(discounts);
            } else {
                await createDiscounts(discounts);
            }

            await fetchDiscountsFiltered();
            closeModal();
        } catch (error) {
            console.error("Error creating discounts:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteDiscounts(discountsId: string) {
        try{ 
            await deleteDiscounts(discountsId);
            await fetchDiscountsFiltered();
        }catch(error){
            console.error("Error deleting discounts:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDescDiscounts) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: Discounts | null) => {
        setSelectedDiscounts(data);
        openModal();
    };

    return (
        <>
            <ModalDiscounts 
                errorInput={errorInput}
                setErrorInput={setErrorInput}
                loading={loading}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedDiscounts} 
                handleCreateDiscounts={handleCreateDiscounts} 
                selected={selectedDiscounts} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<Discounts>
                titleTable=""
                buttonText="Agregar un Descuento"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThDiscounts} 
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
                        discountsList && discountsList.length > 0 ? (
                            discountsList.map((discounts) => (
                                <TableRow key={discounts.id}>
                                    <TableCell className="px-3 py-3 text-left">#{discounts.id}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        {
                                            <div className="flex items-center space-x-4">
                                                <div className="mb-2">
                                                    {
                                                        discounts.product_image && (
                                                        <Image
                                                            width={64}
                                                            height={64}
                                                            unoptimized={process.env.NODE_ENV ? true : false}
                                                            src={`${process.env.NEXT_PUBLIC_URL_IMAGES ?? ""}${typeof discounts.product_image === "string" ? discounts.product_image : discounts.product_image}`}
                                                            alt={discounts.product_name as string}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        )
                                                    }
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-bold">{discounts.product_name}</span>
                                                    <small className="text-gray-500">{discounts.product_slug}</small>
                                                </div>
                                            </div>
                                        }
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        {discounts.discount_type === "percentage" ? `${discounts.discount_value}%` : `${formatPrice(discounts.discount_value)}`}
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div>
                                            <span>{formatDate(discounts.valid_from) ? formatDate(discounts.valid_from) : "No Date"}</span>
                                            <span className="mx-1">-</span>
                                            <span>{formatDate(discounts.valid_until) ? formatDate(discounts.valid_until) : "No Date"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        {
                                            discounts.is_active ? 
                                            <Badge variant="solid" color="success">Activo</Badge> : 
                                            <Badge variant="solid" color="error">Inactivo</Badge>
                                        }
                                    </TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(discounts)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleDeleteDiscounts(discounts.id as string)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="text-center py-4" colSpan={12}>No se encontraron descuentos.</TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}