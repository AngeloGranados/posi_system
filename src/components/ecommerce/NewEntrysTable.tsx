'use client'

import { FilterParams, orderByAscDescProduct, orderByProduct, Product, tableThProduct } from "@/types/produts";
import TablePage from "../tables/TablePage";
import { TableCell, TableRow } from "../ui/table";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import Badge from "../ui/badge/Badge";
import { formatPrice } from "../../../util";
import { useCallback, useEffect, useState } from "react";
import { getProductsFilter } from "@/services/produtsServices";
import debounce from "debounce";

export default function NewEntrysTable() {

    // filter
    const [filters, setFilters] = useState<FilterParams>({
        categoryId: null,
        filterlike: '',
        orderBy: null,
        orderField: null,
        page: 1,
        limit: 100,
        byStatus: "active"
    })

    const [productsList, setProductsList] = useState<Product[]>([]);

    const [pageTotal, setPageTotal] = useState(1)
    const [inputSearch, setInputSearch] = useState('')

    const [loading, setLoading] = useState(false);
    const tableThProducts: tableThProduct[] = [
            { name: "id", value: "ID" },
            { name: "name", value: "Producto" },
            { name: "price", value: "Precio" },
            { name: "stock", value: "Stock" },
            { name: "category_name", value: "Categoría" },
            { name: "description_short", value: "Descripción" },
            { name: "is_active", value: "Estado" }
        ]

    useEffect(() => {
        fetchProductsFiltered()
    }, [filters]);

    async function fetchProductsFiltered() {
    setLoading(true);
    try {
        const response = await getProductsFilter(filters);
        setProductsList(response.products);
        setPageTotal(response.total);
    }catch (error) {
        console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleOrderByAscDesc(field: orderByAscDescProduct) {
        if(filters.orderField === field){
            setFilters((prev) => ({ ...prev, orderBy: prev.orderBy === "ByASC" ? "ByDESC" : "ByASC" }));
        } else {
            setFilters((prev) => ({ ...prev, orderField: field, orderBy: "ByASC" }));
        }
    }

    const debounceOnchangeFilterLike = useCallback(debounce((value: string) => {
        setFilters((prev) => ({ ...prev, filterlike: value }));
    }, 500), []);

    const handleOnchangeFilterLike = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
        debounceOnchangeFilterLike(e.target.value);
    }

    const pageTotalToTable = Math.ceil(pageTotal / filters.limit);

    return (
        <div className="col-span-12 mt-4">
            <TablePage<Product> 
                    titleTable="NUEVOS INGRESOS"
                    showSearch={true}
                    setSearch={handleOnchangeFilterLike}
                    search={inputSearch}
                    orderField={filters.orderField} 
                    orderBy={filters.orderBy} 
                    tableThPage={tableThProducts} 
                    handleOrderByAscDesc={handleOrderByAscDesc} 
                    pageTotal={pageTotalToTable} 
                    page={filters.page}
                    setPage={(page) => setFilters((prev) => ({ ...prev, page }))}
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
                            productsList && productsList.length > 0 ? (
                                productsList.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="px-3 py-3 text-left">#{product.id}</TableCell>
                                        <TableCell className="px-3 py-3 text-left">
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
                                                    <span className="text-[17px] font-bold">{product.name}</span>
                                                    <small className="text-gray-800">{product.slug}</small>
                                                    <small className="text-gray-500">{product.sku}</small>
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
                                        <TableCell className="px-3 py-3 text-left">{product.category_name}</TableCell>
                                        <TableCell className="px-3 my-4 line-clamp text-gray-700">{product.description_short}</TableCell>
                                        <TableCell className="px-3 py-4 text-lef">
                                            {
                                                product.is_active ? 
                                                <Badge variant="solid" color="success">Activo</Badge> : 
                                                <Badge variant="solid" color="error">Inactivo</Badge>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell className="text-center py-4" colSpan={12}>No se encontraron productos.</TableCell>
                                </TableRow>
                            )
                        )
                    }
                </TablePage>
        </div>
    )
}