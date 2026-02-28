'use client'

import { orderBy, orderByAscDesc, orderByAscDescParams, Product } from "@/types/produts"
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import ComponentCard from "@/components/common/ComponentCard";
import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";
import Skeleton from 'react-loading-skeleton'
import Pagination from "@/components/tables/Pagination";
import AddIcon from "../../../public/images/icons/add-icon";
import ButtonOrderAscDesc from "@/app/(admin)/(pages)/products/(components-ui)/(components)/buttonOrderAscDesc";
import { formatPrice } from "../../../util";
import EditIcon from "../../../public/images/icons/edit-icon";
import DeleteIcon from "../../../public/images/icons/delete-icon";

interface TableProductsProps {
    data: Product[];
    OpenModal: (product: Product | null) => void;
    handleDeleteProduct: (productId: number) => void;
    tableThProducts: { name: string, value: string }[];
    handleOrderByAscDesc: orderByAscDescParams;
    orderBy: orderBy;
    orderField: orderByAscDesc | null;
    pageTotal: number;
    page: number;
    setPage: (page: number) => void;
}

export default function TableProducts({ data, OpenModal, handleDeleteProduct, tableThProducts, handleOrderByAscDesc, orderBy, orderField, pageTotal, page, setPage }: TableProductsProps) {

    function handlePageChange(page: number){
        if(page < 1 || page > pageTotal) return;
        setPage(page);
    }

    return (
        <div className="space-y-6">
            <ComponentCard title="Products Table">
                <Button onClick={() => OpenModal(null)} className="flex items-center leading-none float-right"><AddIcon width={17} height={17} fill="currentColor" /> Agregar un producto</Button>
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            {
                                tableThProducts.map((th) => {

                                    if(th.name === 'actions') {
                                        return <TableCell key={th.name} isHeader className="text-ms px-3 text-start text-gray-500 py-3">
                                            {th.value}
                                        </TableCell>
                                    }

                                    return <TableCell key={th.name} isHeader className={`text-ms px-3 ${th.name === "name" ? "px-20" : ""} text-start text-gray-500 py-3`}>
                                        <div className="flex flex-row-reverse items-center justify-center">
                                            <ButtonOrderAscDesc onClick={() => handleOrderByAscDesc(th.name as orderByAscDesc)} isAsc={orderField === th.name ? orderBy === "ByASC" : false} isActive={orderField === th.name as orderByAscDesc}/>
                                            {th.value}
                                        </div>
                                    </TableCell>
                                })
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {
                            data && data.length > 0 ? (
                                data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="px-3 py-3 text-lef">#{product.id}</TableCell>
                                        <TableCell className="px-3 py-3 text-lef">
                                            <div className="flex items-center space-x-4">
                                                <div className="mb-2">
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
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-bold">{product.name}</span>
                                                    <small className="text-gray-500">{product.slug}</small>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-3 py-3 text-left">{formatPrice(product.price)}</TableCell>
                                        <TableCell className="px-3 py-3 text-left">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 object-cover rounded ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                                                {product.stock}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-3 my-4 line-clamp text-gray-700">{product.description_short}</TableCell>
                                        <TableCell className="px-3 py-4 text-lef">{
                                            product.is_active ? 
                                            <Badge variant="solid" color="success">Activo</Badge> : 
                                            <Badge variant="solid" color="error">Inactivo</Badge>
                                            }</TableCell>
                                        <TableCell className="px-3 py-3">
                                            <div className="flex space-x-4">
                                                <Button onClick={() => OpenModal(product)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                                <Button onClick={() => handleDeleteProduct(product.id as number)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
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
                <div className="flex items-center justify-center mt-4">
                    <Pagination currentPage={page as number} totalPages={pageTotal} onPageChange={handlePageChange}></Pagination>
                </div>
            </ComponentCard>
        </div>
    )
}