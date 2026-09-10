'use client'

import { useModal } from "@/hooks/useModal"
import { useEffect, useState } from "react";
import TablePage from "@/components/tables/TablePage";
import { TableRow, TableCell } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import Button from "@/components/ui/button/Button";
import { Orders, filterOptions, orderByAscDescOrders, orderByOrders, statusOrders, tableThOrders } from "@/types/orders";
import { EyeIcon, UserIcon } from "@/icons";
import { cancelOrder, getOrdersFiltered } from "@/services/ordersServices";
import CancelIcon from "../../../../../../public/images/icons/cancel-icon";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import { formatPrice, verifyColorByStatus } from "../../../../../../util";
import { formatDate } from "@fullcalendar/core/index.js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import FiltersComponentOrders from "./filtersComponentOrder";


export default function TableModal() {
    
    const router = useRouter();

    const { isOpen, closeModal, openModal } = useModal();
    const [ordersList, setOrdersList] = useState<Orders[]>([]);

    // filters
    const [filters, setFilters] = useState<filterOptions>({
        orderField: "order_number",
        ByStatus: "pending",
        orderBy: "status",
        filterlike: '',
        limit: 100,
        page: 1
    })

    const [pageTotal, setPageTotal] = useState(1)

    const [loading, setLoading] = useState(false);

    const sweetAlert = withReactContent(Swal);

    const tableThOrders: tableThOrders[] = [
        { name: "order_number", value: "N° Orden" },
        { name: "email", value: "Cliente" },
        { name: "subtotal", value: "Subtotal" },
        { name: "shipping_cost", value: "Envío" },
        { name: "discount", value: "Descuento" },
        { name: "total", value: "Total" },
        { name: "status", value: "Estado & Pago" },
        { name: "created_at", value: "Fecha" },
        { name: "actions", value: "Acciones"},
    ];

    async function fetchOrdersFiltered() {

        setLoading(true);
        try {
            const response = await getOrdersFiltered(filters);
            setOrdersList(response.data);
            setPageTotal(response.totalRows);
        }catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCancelOrder(orderNumber: string) {

        sweetAlert.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas cancelar la orden ${orderNumber}? Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No, mantener",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await cancelOrder(orderNumber);
                    sweetAlert.fire({
                        title: "Orden Cancelada",
                        text: `La orden ${orderNumber} ha sido cancelada exitosamente.`,
                        icon: "success",
                    })
                    fetchOrdersFiltered();
                } catch (error) {
                    console.error("Error canceling order:", error);
                }
            }
        })
    }

    useEffect(() => {
        fetchOrdersFiltered()
    }, [filters]);

    const pageTotalToTable = Math.ceil(pageTotal / filters.limit);

    async function handleOrderByAscDesc(field: orderByAscDescOrders) {
        if(filters.orderField === field){
            setFilters((prev) => ({ ...prev, orderBy: prev.orderBy === "ByASC" ? "ByDESC" : "ByASC" }));
        } else {
            setFilters((prev) => ({ ...prev, orderField: field, orderBy: "ByASC" }));
        }
    }

    function handleStatusChange(status: statusOrders) {
        setFilters((prev) => ({ ...prev, orderBy: "status", ByStatus: status, page: 1 }));
    }

    return (
        <>
            <TablePage<Orders>
                titleTable="Tabla de Órdenes"
                orderField={filters.orderField} 
                filters={<FiltersComponentOrders onTypeOrdersChange={handleStatusChange} />}
                orderBy={filters.orderBy} 
                tableThPage={tableThOrders} 
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                page={filters.page}
                setPage={(page) => setFilters((prev) => ({ ...prev, page }))}
            >
                {
                    loading ? (
                        <TableRow key={"loading"}>
                            <TableCell className="text-center py-4" colSpan={12}>   
                                <div className="w-full h-50">
                                    <Skeleton width={'100%'} height={'100%'} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        ordersList && ordersList.length > 0 ? (
                            ordersList.map((order) => (
                                <TableRow key={`order-${order.order_number}`}>
                                    <TableCell className="px-3 py-3 text-left">{order.order_number}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div className="flex items-center gap-3">
                                            <UserIcon />
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.shipping_address_name}</span>
                                            <small className="text-gray-500">{order.email}</small>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-3 py-3 text-left">{formatPrice(order.subtotal)}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{formatPrice(order.shipping_cost)}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{formatPrice(order.discount)}</TableCell>
                                <TableCell className="px-3 py-3 text-left">{formatPrice(order.total)}</TableCell>
                                <TableCell className="px-3 py-3 text-left">
                                    <div className="flex flex-col items-center gap-2">
                                        {
                                            order.status === "cancelled" ? (
                                                <Badge variant="light" color="error">Orden Cancelada</Badge>
                                            ) : (
                                                <>
                                                    <Badge variant="light" color={verifyColorByStatus(order.status)}>{order.status}</Badge>
                                                    <Badge variant="light" color={ order.is_paid ? "success" : "dark" }>{order.is_paid ? "Pagado" : "No Pagado"}</Badge>
                                                </>
                                            )
                                        }
                                    </div>
                                </TableCell>
                                <TableCell className="px-3 py-3 text-left">
                                    <div className="flex flex-col">
                                        <span>{order.created_at ? formatDate(order.created_at) : ""}</span>
                                        <small className="text-gray-500">{order.created_at ? formatDate(order.created_at, { hour: 'numeric', minute: 'numeric' }) : ""}</small>
                                    </div>
                                </TableCell>
                                <TableCell className="px-3 py-3">
                                    <div className="flex space-x-4">
                                        <Button variant="outline" onClick={() => router.push(`/orders/${order.order_number}`)} className="text-blue-500"><EyeIcon width={16} height={16} fill="currentColor" /></Button>
                                        <Button variant="outline" onClick={() => handleCancelOrder(order.order_number as string)} className={`text-red-500 ${order.status === "cancelled" ? "opacity-50 pointer-events-none" : ""}`}><CancelIcon width={16} height={16} fill="currentColor" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                        ) : (
                            <TableRow key={"no-orders"}>
                                <TableCell className="text-center py-4" colSpan={12}>No se encontraron órdenes.</TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}