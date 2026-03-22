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
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import { ImagesProducts, orderByAscDescImagesProducts, orderByImagesProducts, tableThImagesProducts } from "@/types/images_products";
import { createImagesProducts, deleteImagesProducts, getImagesProductsFiltered, updateImagesProducts } from "@/services/imagesProductsServices";
import ModalImagesProducts from "./modalImagesProducts";


export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedImagesProducts, setSelectedImagesProducts] = useState<ImagesProducts | null>(null);
    const [imagesProductList, setImagesProductsList] = useState<ImagesProducts[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByImagesProducts>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescImagesProducts>("id")
    const [filterlike, setFilterlike] = useState('')

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()
    const [ errorInput, setErrorInput ] = useState<string | null>(null)
    
    const tableThImagesProducts: tableThImagesProducts[] = [
        { name: "id", value: "ID" },
        { name: "product_id", value: "Producto" },
        { name: "alt_text", value: "Texto Alternativo" },
        { name: "sort_order", value: "Orden" },
        { name: "attribute_value", value: "Valor del Atributo" },
        { name: "actions", value: "Acciones" }
    ]

    async function fetchImagesProductsFiltered() {
        setLoading(true);
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getImagesProductsFiltered({orderBy, orderField, limit, page});
            setImagesProductsList(response.data);
            setPageTotal(response.totalRows); // Actualiza el total de elementos
        }catch (error) {
            console.error("Error fetching imagesProduct:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchImagesProductsFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    // El total de páginas debe ser calculado con el total de elementos
    const pageTotalToTable = Math.max(1, Math.ceil(pageTotal / limit));

    async function handleCreateImagesProducts(event: React.FormEvent<HTMLFormElement>, imagesProduct: ImagesProducts) {
        event.preventDefault();

        let error = null;
        let fieldError = null;

        const requiredFields: (keyof ImagesProducts)[] = [ "product_id" , "image_url" , "alt_text" , "sort_order"];

        for (const field of requiredFields) {
            if (field != "sort_order") {
                if (!imagesProduct[field] || (imagesProduct[field] as string).toString().trim() === "") {
                    error = `El campo ${field} es obligatorio.`;
                    fieldError = field;
                    break;
                }
            }

            if(field === "sort_order" && isNaN(Number(imagesProduct.sort_order))){
                error = `El orden debe ser un numero`;
                fieldError = field;
                break;
            }
        }

        if (error) {    
            triggerAlert("Error", error, "error")
            setErrorInput(fieldError);
            return;
        }

        try {
            setLoading(true);
            if (selectedImagesProducts) {
                await updateImagesProducts(imagesProduct);
            } else {
                await createImagesProducts(imagesProduct);
            }

            await fetchImagesProductsFiltered();
            closeAlert();
            closeModal();
        } catch (error) {
            triggerAlert("Error", error instanceof Error ? error.message : "Error desconocido", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteImagesProducts(imagesProductId: string) {
        try{ 
            await deleteImagesProducts(imagesProductId);
            await fetchImagesProductsFiltered();
        }catch(error){
            console.error("Error deleting imagesProduct:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDescImagesProducts) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: ImagesProducts | null) => {
        setSelectedImagesProducts(data);
        openModal();
    };

    return (
        <>
            <ModalImagesProducts
                errorInput={errorInput}
                setErrorInput={setErrorInput}
                loading={loading}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedImagesProducts} 
                handleCreateImagesProducts={handleCreateImagesProducts} 
                selected={selectedImagesProducts} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<ImagesProducts>
                titleTable=""
                buttonText="Agregar Imagen de Producto"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThImagesProducts} 
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
                        imagesProductList && imagesProductList.length > 0 ? (
                            imagesProductList.map((imagesProduct) => (
                                <TableRow key={imagesProduct.id}>
                                    <TableCell className="px-3 py-3 text-left">#{imagesProduct.id}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        {
                                            <div className="flex items-center space-x-4">
                                                <div className="mb-2">
                                                    {
                                                        <Image
                                                            width={64}
                                                            height={64}
                                                            unoptimized={process.env.NODE_ENV ? true : false}
                                                            src={`${process.env.NEXT_PUBLIC_URL_IMAGES ?? ""}${typeof imagesProduct.image_url === "string" ? imagesProduct.image_url : imagesProduct.image_url}`}
                                                            alt={imagesProduct.product_name as string}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    }
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-bold">{imagesProduct.product_name}</span>
                                                    <small className="text-gray-500">{imagesProduct.product_slug}</small>
                                                </div>
                                            </div>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {imagesProduct.alt_text}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            imagesProduct.sort_order === 0 ? (
                                                <Badge variant="light" color="primary">Principal</Badge>
                                            ) : (
                                                <Badge variant="light" color="warning">Imagen adicional Nro: {imagesProduct.sort_order}</Badge>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {imagesProduct.attribute_value}
                                    </TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(imagesProduct)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleDeleteImagesProducts(imagesProduct.id as string)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="text-center py-4" colSpan={12}>No se encontraron Images.</TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}