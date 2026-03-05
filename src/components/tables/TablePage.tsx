'use client'

import { orderByAscDescProduct, orderByProduct, Product } from "@/types/produts"
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import ComponentCard from "@/components/common/ComponentCard";
import Pagination from "@/components/tables/Pagination";
import AddIcon from "../../../public/images/icons/add-icon";
import ButtonOrderAscDesc from "./ButtonOrderAscDesc";
import { Categories, orderByAscDescCategories, orderByCategories } from "@/types/categories";
import { Brands, orderByAscDescBrands, orderByBrands } from "@/types/brands";
import { orderByAscDescPaymentMethods, orderByPaymentMethods, PaymentMethods } from "@/types/paymentMethods";
import { orderByAscDescShippingMethods, orderByShippingMethods, ShippingMethods } from "@/types/shippingMethods";
import { orderByAscDescPromoCodes, orderByPromoCodes, PromoCodes } from "@/types/promoCodes";
import { Discounts, orderByAscDescDiscounts, orderByDiscounts } from "@/types/discounts";
import { orderByAscDescOrders, orderByOrders, Orders } from "@/types/orders";

type orderByAscDescT<T> = 
T extends Product ? orderByAscDescProduct : 
T extends Categories ? orderByAscDescCategories : 
T extends Brands ? orderByAscDescBrands : 
T extends PaymentMethods ? orderByAscDescPaymentMethods :
T extends ShippingMethods ? orderByAscDescShippingMethods :
T extends PromoCodes ? orderByAscDescPromoCodes :
T extends Discounts ? orderByAscDescDiscounts :
T extends Orders ? orderByAscDescOrders :
never;

type orderByT<T> =
  T extends Product ? orderByProduct :
  T extends Categories ? orderByCategories :
  T extends Brands ? orderByBrands :
  T extends PaymentMethods ? orderByPaymentMethods :
  T extends ShippingMethods ? orderByShippingMethods :
  T extends PromoCodes ? orderByPromoCodes :
  T extends Discounts ? orderByDiscounts :
  T extends Orders ? orderByOrders :
  never;

interface TablePageProps<T> {
    titleTable: string;
    children: React.ReactNode;
    OpenModal: (data: T | null) => void;
    tableThPage: { name: string, value: string }[];
    handleOrderByAscDesc: (field: orderByAscDescT<T>) => Promise<void>;
    orderBy: orderByT<T>;
    orderField: orderByAscDescT<T> | null;
    pageTotal: number;
    page: number;
    setPage: (page: number) => void;
    buttonText?: string;
}

export default function TablePage<T>({ children, titleTable, buttonText, OpenModal, tableThPage, handleOrderByAscDesc, orderBy, orderField, pageTotal, page, setPage }: TablePageProps<T>) {

    function handlePageChange(page: number){
        if(page < 1 || page > pageTotal) return;
        setPage(page);
    }

    return (
        <div className="space-y-6">
            <ComponentCard title={titleTable}>
                {buttonText && <Button onClick={() => OpenModal(null)} className="flex items-center leading-none float-right"><AddIcon width={17} height={17} fill="currentColor" /> {buttonText}</Button>}
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            {
                                tableThPage.map((th) => {

                                    if(th.name === 'actions') {
                                        return <TableCell key={th.name} isHeader className="text-ms px-3 text-start text-gray-500 py-3">
                                            {th.value}
                                        </TableCell>
                                    }

                                    return <TableCell key={th.name} isHeader className={`text-ms px-3 ${th.name === "name" ? "px-20" : ""} text-start text-gray-500 py-3`}>
                                        <div className="flex flex-row-reverse items-center justify-end">
                                            <ButtonOrderAscDesc onClick={() => handleOrderByAscDesc(th.name as orderByAscDescT<T>)} isAsc={orderField === th.name ? orderBy === "ByASC" : false} isActive={orderField === th.name as orderByAscDescT<T>}/>
                                            {th.value}
                                        </div>
                                    </TableCell>
                                })
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {children}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-center mt-4">
                    <Pagination currentPage={page as number} totalPages={pageTotal} onPageChange={handlePageChange}></Pagination>
                </div>
            </ComponentCard>
        </div>
    )
}