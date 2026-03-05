'use client'

import { useModal } from "@/hooks/useModal"
import { useEffect, useState } from "react";
import TablePage from "@/components/tables/TablePage";
import { TableRow, TableCell } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/button/Button";
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";
import { Orders, orderByAscDescOrders, orderByOrders, tableThOrders } from "@/types/orders";
import { EyeIcon } from "@/icons";
import { getOrdersFiltered } from "@/services/ordersServices";
import CancelIcon from "../../../../../../public/images/icons/cancel-icon";
import { useRouter } from "next/navigation";


export default function TableModal() {
    
    const router = useRouter();

    const { isOpen, closeModal, openModal } = useModal();
    const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
    const [ordersList, setOrdersList] = useState<Orders[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByOrders>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescOrders>("id")
    const [filterlike, setFilterlike] = useState('')

    const tableThOrders: tableThOrders[] = [
        { name: "id", value: "ID" },
        { name: "order_number", value: "N° Orden" },
        { name: "email", value: "Cliente" },
        { name: "subtotal", value: "Subtotal" },
        { name: "shipping_cost", value: "Envío" },
        { name: "discount", value: "Descuento" },
        { name: "total", value: "Total" },
        { name: "status", value: "Estado" },
        { name: "is_paid", value: "Pagado" },
        { name: "created_at", value: "Fecha" },
        { name: "actions", value: "Acciones"},
    ];

    async function fetchOrdersFiltered() {
        try {
            const response = await getOrdersFiltered({orderBy, orderField, limit, page});// Agrega este log para verificar la respuesta
            setOrdersList(response.data);
            setPageTotal(response.totalRows);
        }catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        fetchOrdersFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    const pageTotalToTable = Math.ceil(pageTotal / limit);

    async function handleOrderByAscDesc(field: orderByAscDescOrders) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: Orders | null) => {
        setSelectedOrder(data);
        openModal();
    };

    return (
        <>
            <TablePage<Orders>
                titleTable="Tabla de Órdenes"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThOrders} 
                OpenModal={handleOpenModal}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                page={page}
                setPage={setPage}
            >
                {
                    ordersList && ordersList.length > 0 ? (
                        ordersList.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="px-3 py-3 text-left">#{order.id}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{order.order_number}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{order.email}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{order.subtotal}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{order.shipping_cost}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{order.discount}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{order.total}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{order.status}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{order.is_paid ? "Sí" : "No"}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{order.created_at ? new Date(order.created_at).toLocaleString() : ""}</TableCell>
                                <TableCell className="px-3 py-3">
                                    <div className="flex space-x-4">
                                        <Button variant="outline" onClick={() => router.push(`/orders/${order.id}`)} className="text-blue-500"><EyeIcon width={16} height={16} fill="currentColor" /></Button>
                                        <Button variant="outline" className="text-red-500"><CancelIcon width={16} height={16} fill="currentColor" /></Button>
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