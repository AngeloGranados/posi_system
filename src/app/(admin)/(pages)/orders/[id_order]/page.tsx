'use client'
import ComponentCard from "@/components/common/ComponentCard";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getOrderById, getOrderItemsByOrderId, updateStatusOrder } from "@/services/ordersServices";
import { OrderItems, Orders, statusOrders } from "@/types/orders";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatPrice, formatTelephone, verifyColorByStatus } from "../../../../../../util";
import Badge from "@/components/ui/badge/Badge";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { formatDate } from "@fullcalendar/core/index.js";

export default function OrderDetails() {

    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Orders | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItems[]>([]);
    const [FormDataOrder, setFormDataOrder] = useState<Partial<Orders>>({
        status: null,
        is_paid: false,
    });
    const [isValid, setIsValid] = useState(false);
    const isPaidSelectedFirstTime = useRef(false);

    const id_order = params.id_order ? params.id_order as string : "";

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await getOrderById(id_order);
                console.log("Order data fetched:", orderData);
                setOrder(orderData);
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };

        const fetchItemsOrder = async () => {
            try {
                const orderItems = await getOrderItemsByOrderId(id_order);
                setOrderItems(orderItems);
            }catch (error) {
                console.error("Error fetching order items:", error);
            }
        }
        fetchOrder();
        fetchItemsOrder();
    }, [params.id_order]);

    useEffect(() => {
        if(order){
            setFormDataOrder({is_paid: typeof order.is_paid === "boolean" ? order.is_paid : order.is_paid === 1});
        }
    }, [order])

    
    useEffect(() => {

        if ((FormDataOrder.status == null || FormDataOrder.status === "" as statusOrders) || !isPaidSelectedFirstTime.current) {
            setIsValid(false);
            return;
        }

        setIsValid(true);
    }, [FormDataOrder])

    async function handleUpdateStatusOrder() {
        try {
            if (!isValid) {
                return;
            }

            const response = await updateStatusOrder(id_order, FormDataOrder)
            alert("Estado de la orden actualizado correctamente");
            router.push("/orders");
        }catch (error) {
            console.error("Error updating order status:", error);
        }
    }

    function handleChangeIsPaid(value: boolean) {
        if (!isPaidSelectedFirstTime.current) {
            isPaidSelectedFirstTime.current = true;
            setFormDataOrder({ ...FormDataOrder, is_paid: value });
        } else {
            setFormDataOrder({ ...FormDataOrder, is_paid: value });
        }
    }
    
    if (!order || orderItems.length === 0) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <PageBreadcrumb pageTitle={`Detalle de Orden`} pageBaseName="Ordenes" pageBaseUrl="/orders"></PageBreadcrumb>
            <ComponentCard title={`Orden #${order.order_number}`}>  
                <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 ${order.status === "cancelled" ? "opacity-50 pointer-events-none" : ""}`}>
                    {/* Estado */}
                    <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow border">
                        <span className="text-xs text-gray-500 mb-1">ESTADO</span>
                        <Badge variant="light" 
                        color={verifyColorByStatus(order.status)}>{order.status}</Badge>
                        <FormRow>
                            <FormGroupInput>
                                <Label htmlFor="status" className="text-center">Cambiar estado:</Label>
                                <Select value={FormDataOrder.status ? FormDataOrder.status : ""} onChange={(e) => setFormDataOrder({ ...FormDataOrder, status: e.target.value as statusOrders })} options={[
                                    { value: "pending", label: "Pendiente" },
                                    { value: "processing", label: "En proceso" },
                                    { value: "shipped", label: "Enviado" },
                                    { value: "delivered", label: "Entregado" },
                                    { value: "cancelled", label: "Cancelado" },
                                ]} name="status" />
                            </FormGroupInput>
                        </FormRow>
                    </div>
                    {/* Total */}
                    <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow border">
                        <span className="text-xs text-gray-500 mb-1">TOTAL</span>
                        <span className="text-2xl font-bold">{formatPrice(order.total)} <span className="text-xs font-normal text-gray-400">PEN</span></span>
                    </div>
                    {/* Fecha */}
                    <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow border">
                        <div className="flex flex-col items-center mb-2">
                            <span className="text-xs text-gray-500 mb-1">FECHA DE CREACIÓN:</span>
                            <span className="text-lg font-semibold">{formatDate(order.created_at as Date, {year:"numeric", month:"numeric", day: "numeric", hour: "numeric"})}</span>
                        </div>
                        <div className="flex flex-col items-center mb-2">
                            <span className="text-xs text-gray-500 mb-1">ULTIMA ACTUALIZACIÓN:</span>
                            <span className="text-lg font-semibold">{formatDate(order.updated_at as Date, {year:"numeric", month:"numeric", day: "numeric", hour: "numeric"})}</span>
                        </div>
                    </div>
                    {/* Pagada */}
                    <div className={`bg-white rounded-lg p-4 flex flex-col items-center shadow border ${order.status === "cancelled" ? "opacity-50 pointer-events-none" : ""}`}>
                        <span className="text-xs text-gray-500 mb-1">PAGADA</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{order.is_paid ? 'Sí' : 'No'}</span>
                        <FormRow>
                            <FormGroupInput>
                                <Label htmlFor="status" className="text-center">Cambiar estado del Pago:</Label>
                                <Checkbox checked={FormDataOrder.is_paid as boolean} onChange={() => handleChangeIsPaid(!FormDataOrder.is_paid as boolean)} name="is_paid" label={`${FormDataOrder.is_paid ? 'Marcar como no pagada' : 'Marcar como pagada'}`} />
                            </FormGroupInput>
                        </FormRow>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[auto_2fr] gap-6 mb-6">
                    <div className="flex flex-col items-center gap-3 mb-2">
                        {/* Información del Cliente */}
                        <div className="bg-white rounded-lg p-6 shadow border flex flex-col">
                            <span className="font-semibold text-gray-700 mb-2">Información del Cliente</span>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">{order.email?.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div className="font-medium">{order.user_full_name || order.billing_address_name}</div>
                                    {/* <div className="text-xs text-gray-400">Cliente desde {order.created_at ? new Date(order.created_at).getFullYear() : "-"}</div> */}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">EMAIL</div>
                            <div className="mb-2">{order.email}</div>
                            {/* Si tienes teléfono, agrégalo aquí */}
                        </div>
                        {/* Dirección de envío */}
                        <div className="w-full bg-white rounded-lg p-6 shadow border flex flex-col">
                            <span className="font-semibold text-gray-700 mb-2">Dirección de envío</span>
                            {/* Aquí deberías mostrar la dirección completa si la tienes */}
                            <div className="text-sm text-gray-600">
                                {order.shipping_address_details} <br />
                                {order.shipping_address_name} <br />
                                {formatTelephone(order.shipping_address_phone as string)}
                            </div>
                        </div>
                        {/* Dirección de facturación */}
                        <div className="w-full bg-white rounded-lg p-6 shadow border flex flex-col">
                            <span className="font-semibold text-gray-700 mb-2">Dirección de facturación</span>
                            {/* Aquí deberías mostrar la dirección completa si la tienes */}
                            <div className="text-sm text-gray-600">
                                {order.billing_address_details} <br />
                                {order.billing_address_name} <br />
                                {formatTelephone(order.billing_address_phone as string)}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 mb-2">
                        {/* Productos */}
                        <div className="w-full bg-white rounded-lg p-6 shadow border flex flex-col">
                            <span className="font-semibold text-gray-700 mb-2">Productos</span>
                            {/* Aquí deberías mapear los productos de la orden si tienes la relación */}
                            <div className="text-sm text-gray-600">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell isHeader>PRODUCTO</TableCell>
                                            <TableCell isHeader>CANTIDAD</TableCell>
                                            <TableCell isHeader>PRECIO UNIT.</TableCell>
                                            <TableCell isHeader>SUBTOTAL</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orderItems && orderItems.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell className="px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center w-16 h-16  rounded-full">
                                                            <Image unoptimized src={item.image_url ? `${process.env.NEXT_PUBLIC_URL_IMAGES}${item.image_url}` : "/image/error/404_image.png"} alt={item.product_name as string} width={100} height={100} />
                                                        </div>
                                                        <div>
                                                            <strong>{item.product_name}</strong>
                                                            {
                                                                item.selected_attributes && (
                                                                    <div className="text-xs text-gray-800">
                                                                        {
                                                                            Object.entries(item.selected_attributes).map(([key, value]) => (
                                                                                <div key={key}>{key}: {value}</div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4">{item.quantity}</TableCell>
                                                <TableCell className="px-4">{formatPrice(item.price as string)}</TableCell>
                                                <TableCell className="px-4">{formatPrice(item.subtotal as string)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-3 mb-2">
                            <div className="w-full bg-white rounded-lg p-6 shadow border flex flex-col items-center text-center">
                                <div className="flex items-center gap-3">
                                   <div>
                                        <div className="text-xs text-gray-400">Método de pago</div>
                                        <div className="font-medium">{order.payment_method_name}</div>
                                    </div>
                                </div>
                            </div>
                            {/* Resumen de totales */}
                            <div className="w-80 bg-white rounded-lg p-6 shadow border flex flex-col max-w-md mx-auto mb-6">
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>Envío</span>
                                    <span>{formatPrice(order.shipping_cost === 0 ? 'Gratis' : `${order.shipping_cost}`)}</span>
                                </div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>Descuento</span>
                                    <span>{formatPrice(order.discount)}</span>
                                </div>
                                {
                                    order && 
                                    order.payment_method_name && 
                                    order.payment_method_name.toLowerCase() === "izipay" && (
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span>Izipay</span>
                                            <span>{formatPrice((Number(order.total) / (1 - 0.05)) - Number(order.total))}</span>
                                        </div>
                                    )
                                }
                                <div className="flex justify-between mb-2 text-sm font-bold">
                                    <span>Total</span>
                                    <span className="text-green-600">{order.payment_method_name && order.payment_method_name.toLowerCase() === "izipay" ? formatPrice((Number(order.total) + ((Number(order.total) / (1 - 0.05)) - Number(order.total)))) : formatPrice(Number(order.total))}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleUpdateStatusOrder} disabled={!isValid}>
                        Actualizar Estado
                    </Button>
                </div>

                {/* Nota interna */}
                {order.notes && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800 text-sm rounded mb-4">
                        <strong>Nota Interna</strong><br />
                        {order.notes}
                    </div>
                )}
            </ComponentCard>
        </div>
    )
}