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
import ModalDiscounts from "./modalPromoCodes";


export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedDiscounts, setSelectedDiscounts] = useState<Discounts | null>(null);
    const [discountsList, setDiscountsList] = useState<Discounts[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByDiscounts>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescDiscounts>("id")
    const [filterlike, setFilterlike] = useState('')

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()

    const tableThDiscounts: tableThDiscounts[] = [
        { name: "id", value: "ID" },
        { name: "product_id", value: "Producto(ID)" },
        { name: "discount_type", value: "Tipo de Descuento" },
        { name: "valid_from", value: "Válido Desde" },
        { name: "is_active", value: "Estado" }, 
        { name: "actions", value: "Acciones" }
    ]

    async function fetchDiscountsFiltered() {
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getDiscountsFiltered({orderBy, orderField, limit, page});
            setDiscountsList(response.data);
            setPageTotal(response.totalRows); // Actualiza el total de elementos
        }catch (error) {
            console.error("Error fetching discounts:", error);
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

        const requiredFields: (keyof Discounts)[] = ["product_id", "discount_type", "valid_from", "valid_until"];

        for (const field of requiredFields) {
            if (!discounts[field] || (discounts[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
                break;
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            return;
        }

        try {
            if (selectedDiscounts) {
                await updateDiscounts(discounts);
            } else {
                await createDiscounts(discounts);
            }

            await fetchDiscountsFiltered();
            closeModal();
        } catch (error) {
            console.error("Error creating discounts:", error);
        }
    }

    async function handleDeleteDiscounts(discountsId: number) {
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
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedDiscounts} 
                handleCreateDiscounts={handleCreateDiscounts} 
                selected={selectedDiscounts} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<Discounts>
                titleTable="Métodos de Envío"
                buttonText="Agregar un Método de Envío"
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
                    discountsList && discountsList.length > 0 ? (
                        discountsList.map((discounts) => (
                            <TableRow key={discounts.id}>
                                <TableCell className="px-3 py-3 text-left">#{discounts.id}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{discounts.product_id}</TableCell>
                                <TableCell className="px-3 py-3 text-left">
                                    {discounts.discount_type === "percentage" ? `${discounts.discount_value}%` : `$${discounts.discount_value}`}
                                </TableCell>
                                <TableCell className="px-3 py-3 text-left">
                                    <div>
                                        <span>{discounts.valid_from ? discounts.valid_from.toString() : "No Date"}</span>
                                        <span className="mx-1">-</span>
                                        <span>{discounts.valid_until ? discounts.valid_until.toString() : "No Date"}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-3 py-3 text-left">{discounts.is_active ? "Active" : "Inactive"}</TableCell>
                                <TableCell className="px-3 py-3">
                                    <div className="flex space-x-4">
                                        <Button onClick={() => handleOpenModal(discounts)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                        <Button onClick={() => handleDeleteDiscounts(discounts.id as number)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
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