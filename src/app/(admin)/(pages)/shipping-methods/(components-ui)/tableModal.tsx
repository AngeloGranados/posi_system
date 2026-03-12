'use client'

import { useModal } from "@/hooks/useModal"
import { useEffect, useState } from "react";
import useAlert from "@/hooks/useAlert";
import TablePage from "@/components/tables/TablePage";
import { TableRow, TableCell } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import EditIcon from "../../../../../../public/images/icons/edit-icon";
import Button from "@/components/ui/button/Button";
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";
import { orderByAscDescShippingMethods, orderByShippingMethods, ShippingMethods, tableThShippingMethods } from "@/types/shippingMethods";
import { createShippingMethods, deleteShippingMethods, getShippingMethodsFiltered, updateShippingMethods } from "@/services/shippingMehods";
import ModalShippingMethods from "./modalShippingMethods";
import { verifyColorByStatus } from "../../../../../../util";
import Badge from "@/components/ui/badge/Badge";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedShippingMethods, setSelectedShippingMethods] = useState<ShippingMethods | null>(null);
    const [shippingMethodList, setShippingMethodsList] = useState<ShippingMethods[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByShippingMethods>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescShippingMethods>("id")
    const [filterlike, setFilterlike] = useState('')

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()
    const [ errorInput, setErrorInput ] = useState<string | null>(null)

    const tableThShippingMethods: tableThShippingMethods[] = [
        { name: "id", value: "ID" },
        { name: "name", value: "Nombre" },
        { name: "estimated_days_min", value: "Tiempo estimado (min - max)" },
        { name: "description", value: "Descripción" },
        { name: "price", value: "Precio" },
        { name: "is_active", value: "Estado" },
        { name: "actions", value: "Acciones" }
    ]

    async function fetchShippingMethodsFiltered() {
        setLoading(true);
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getShippingMethodsFiltered({orderBy, orderField, limit, page});
            setShippingMethodsList(response.data);
            setPageTotal(response.totalRows); // Actualiza el total de elementos
        }catch (error) {
            console.error("Error fetching shippingMethod:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchShippingMethodsFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    // El total de páginas debe ser calculado con el total de elementos
    const pageTotalToTable = Math.max(1, Math.ceil(pageTotal / limit));

    async function handleCreateShippingMethods(event: React.FormEvent<HTMLFormElement>, shippingMethod: ShippingMethods) {
        event.preventDefault();

        let error = null;
        let fieldError = null;

        const requiredFields: (keyof ShippingMethods)[] = ["name" ];

        for (const field of requiredFields) {
            if (!shippingMethod[field] || (shippingMethod[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
                fieldError = field;
                break;
            }
        }

        if (error) {
            setErrorInput(fieldError);
            triggerAlert("Error", error, "error")
            return;
        }

        try {
            if (selectedShippingMethods) {
                await updateShippingMethods(shippingMethod);
            } else {
                await createShippingMethods(shippingMethod);
            }

            await fetchShippingMethodsFiltered();
            closeModal();
        } catch (error) {
            console.error("Error creating shippingMethod:", error);
        }
    }

    async function handleDeleteShippingMethods(shippingMethodId: number) {
        try{ 
            await deleteShippingMethods(shippingMethodId);
            await fetchShippingMethodsFiltered();
        }catch(error){
            console.error("Error deleting shippingMethod:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDescShippingMethods) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: ShippingMethods | null) => {
        setSelectedShippingMethods(data);
        openModal();
    };

    return (
        <>
            <ModalShippingMethods
                errorInput={errorInput} 
                setErrorInput={setErrorInput}
                loading={loading}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedShippingMethods} 
                handleCreateShippingMethods={handleCreateShippingMethods} 
                selected={selectedShippingMethods} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<ShippingMethods>
                titleTable=""
                buttonText="Agregar un Método de Envío"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThShippingMethods} 
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
                        shippingMethodList && shippingMethodList.length > 0 ? (
                            shippingMethodList.map((shippingMethod) => (
                                <TableRow key={shippingMethod.id}>
                                    <TableCell className="px-3 py-3 text-left">#{shippingMethod.id}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-bold">{shippingMethod.name}</span>
                                                <small className="text-gray-500">Code: {shippingMethod.code}</small>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-500">Min: {shippingMethod.estimated_days_min} días</span>
                                                <span className="text-gray-500">Max: {shippingMethod.estimated_days_max} días</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">{shippingMethod.description}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{shippingMethod.price}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        {
                                        shippingMethod.is_active ? 
                                            <Badge variant="solid" color="success">Activo</Badge> : 
                                            <Badge variant="solid" color="error">Inactivo</Badge>
                                        }
                                    </TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(shippingMethod)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleDeleteShippingMethods(shippingMethod.id as number)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="text-center py-4" colSpan={12}>
                                    No hay métodos de envío disponibles.
                                </TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}