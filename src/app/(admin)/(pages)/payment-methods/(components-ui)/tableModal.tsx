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
import { orderByAscDescPaymentMethods, orderByPaymentMethods, PaymentMethods, tableThPaymentMethods } from "@/types/paymentMethods";
import { createPaymentMethods, deletePaymentMethods, getPaymentMethodsFiltered, updatePaymentMethods } from "@/services/paymentMethods";
import ModalPaymentMethods from "./modalBrands";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethods | null>(null);
    const [paymentMethodList, setPaymentMethodsList] = useState<PaymentMethods[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByPaymentMethods>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescPaymentMethods>("id")
    const [filterlike, setFilterlike] = useState('')

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()

    const tableThPaymentMethods: tableThPaymentMethods[] = [
        { name: "id", value: "ID" },
        { name: "name", value: "Nombre" },
        { name: "account_name", value: "Cuenta" },
        { name: "description", value: "Descripción" },
        { name: "is_active", value: "Estado" },
        { name: "actions", value: "Acciones" }
    ]

    async function fetchPaymentMethodsFiltered() {
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getPaymentMethodsFiltered({orderBy, orderField, limit, page});
            setPaymentMethodsList(response.data);
            setPageTotal(response.totalRows); // Actualiza el total de elementos
        }catch (error) {
            console.error("Error fetching paymentMethod:", error);
        }
    }

    useEffect(() => {
        fetchPaymentMethodsFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    // El total de páginas debe ser calculado con el total de elementos
    const pageTotalToTable = Math.max(1, Math.ceil(pageTotal / limit));

    async function handleCreatePaymentMethods(event: React.FormEvent<HTMLFormElement>, paymentMethod: PaymentMethods) {
        event.preventDefault();

        let error = null;

        const requiredFields: (keyof PaymentMethods)[] = ["name" ];

        for (const field of requiredFields) {
            if (!paymentMethod[field] || (paymentMethod[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
                break;
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            return;
        }

        try {
            if (selectedPaymentMethods) {
                await updatePaymentMethods(paymentMethod);
            } else {
                await createPaymentMethods(paymentMethod);
            }

            await fetchPaymentMethodsFiltered();
            closeModal();
        } catch (error) {
            console.error("Error creating paymentMethod:", error);
        }
    }

    async function handleDeletePaymentMethods(paymentMethodId: number) {
        try{ 
            await deletePaymentMethods(paymentMethodId);
            await fetchPaymentMethodsFiltered();
        }catch(error){
            console.error("Error deleting paymentMethod:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDescPaymentMethods) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: PaymentMethods | null) => {
        setSelectedPaymentMethods(data);
        openModal();
    };

    return (
        <>
            <ModalPaymentMethods 
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedPaymentMethods} 
                handleCreatePaymentMethods={handleCreatePaymentMethods} 
                selected={selectedPaymentMethods} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<PaymentMethods>
                titleTable="Marcas"
                buttonText="Agregar una Marca"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThPaymentMethods} 
                OpenModal={handleOpenModal}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                page={page}
                setPage={setPage}
            >
                {
                    paymentMethodList && paymentMethodList.length > 0 ? (
                        paymentMethodList.map((paymentMethod) => (
                            <TableRow key={paymentMethod.id}>
                                <TableCell className="px-3 py-3 text-left">#{paymentMethod.id}</TableCell>
                                <TableCell className="px-3 py-3 text-left">
                                    <div className="flex items-center space-x-4">
                                        <div className="mb-2">
                                            {
                                                paymentMethod.image_url && (
                                                <Image
                                                    width={64}
                                                    height={64}
                                                    unoptimized={process.env.NODE_ENV ? true : false}
                                                    src={`${process.env.NEXT_PUBLIC_URL_IMAGES ?? ""}${typeof paymentMethod.image_url === "string" ? paymentMethod.image_url : paymentMethod.image_url}`}
                                                    alt={paymentMethod.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                )
                                            }
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-bold">{paymentMethod.name}</span>
                                            <small className="text-gray-500">Code: {paymentMethod.code}</small>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-3 py-3 text-left">
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-bold">{paymentMethod.account_name}</span>
                                        <small className="text-gray-500">Nro cuenta: {paymentMethod.account_number}</small>
                                    </div>
                                </TableCell>
                                <TableCell className="px-3 py-3 text-left">{paymentMethod.description}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{paymentMethod.is_active ? "Active" : "Inactive"}</TableCell>
                                <TableCell className="px-3 py-3">
                                    <div className="flex space-x-4">
                                        <Button onClick={() => handleOpenModal(paymentMethod)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                        <Button onClick={() => handleDeletePaymentMethods(paymentMethod.id as number)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
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