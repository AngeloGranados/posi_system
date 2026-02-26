'use client'

import { orderBy, orderByAscDesc, orderByAscDescParams, Product } from "@/types/produts"
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import ComponentCard from "@/components/common/ComponentCard";
import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";
import Skeleton from 'react-loading-skeleton'
import { useEffect, useState } from "react";
import ButtonOrderAscDesc from "./(components)/buttonOrderAscDesc";

interface TableProductsProps {
    data: Product[];
    OpenModal: (product: Product | null) => void;
    handleDeleteProduct: (productId: number) => void;
    tableThProducts: { name: string, value: string }[];
    handleOrderByAscDesc: orderByAscDescParams;
    orderBy: orderBy;
    orderField: orderByAscDesc | null;
}

export default function TableProducts({ data, OpenModal, handleDeleteProduct, tableThProducts, handleOrderByAscDesc, orderBy, orderField }: TableProductsProps) {

    return (
        <div className="space-y-6">
            <ComponentCard title="Products Table">
                <Button onClick={() => OpenModal(null)} className="float-right">Agregar un producto</Button>
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            {
                                tableThProducts.map((th) => (
                                    <TableCell key={th.name} isHeader className="px-3 text-start text-gray-500 py-3">
                                        <ButtonOrderAscDesc onClick={() => handleOrderByAscDesc(th.name as orderByAscDesc)} isAsc={orderField === th.name} isActive={orderField === th.name as orderByAscDesc}/>
                                        {th.value}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {
                            data && data.length > 0 ? (
                                data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="px-3 py-3">{product.id}</TableCell>
                                        <TableCell className="px-3 py-3">
                                            {
                                                product.image && (
                                                 <Image
                                                    width={64}
                                                    height={64}
                                                    unoptimized={process.env.NODE_ENV ? true : false}
                                                    src={`${process.env.NEXT_PUBLIC_URL_IMAGES ?? ""}${typeof product.image === "string" ? product.image : product.image}`}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                )
                                            }
                                        </TableCell>
                                        <TableCell className="px-3 py-3">{product.name}</TableCell>
                                        <TableCell className="px-3 py-3">{product.slug}</TableCell>
                                        <TableCell className="px-3 py-3">${product.price}</TableCell>
                                        <TableCell className="px-3 py-3">{product.stock}</TableCell>
                                        <TableCell className="px-3 py-4">{product.description_short}</TableCell>
                                        <TableCell className="px-3 py-4">{product.discount}</TableCell>
                                        <TableCell className="px-3 py-4">{
                                            product.is_active ? 
                                            <Badge variant="solid" color="success">Activo</Badge> : 
                                            <Badge variant="solid" color="error">Inactivo</Badge>
                                            }</TableCell>
                                        <TableCell className="px-3 py-3">
                                            <div className="flex space-x-4">
                                                <Button onClick={() => OpenModal(product)} variant="outline" className="text-blue-500">Editar</Button>
                                                <Button onClick={() => handleDeleteProduct(product.id as number)} variant="outline" className="text-red-500">Eliminar</Button>
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
                    </TableBody>
                </Table>
            </ComponentCard>
        </div>
    )
}