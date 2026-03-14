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
import { Attributes, orderByAscDescAttributes, orderByAttributes, tableThAttributes } from "@/types/attributes";
import { createAttributes, deleteAttributes, getAttributesFiltered, updateAttributes } from "@/services/attributesServices";
import ModalAttributes from "./modalAttributes";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedAttributes, setSelectedAttributes] = useState<Attributes | null>(null);
    const [attributeList, setAttributesList] = useState<Attributes[]>([]);

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByAttributes>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescAttributes>("id")
    const [filterlike, setFilterlike] = useState('')

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()
    const [ errorInput, setErrorInput ] = useState<string | null>(null)

    const tableThAttributes: tableThAttributes[] = [
        { name: "id", value: "ID" },
        { name: "category_id", value: "Categoria" },
        { name: "attribute_name", value: "Nombre del Atributo" },
        { name: "attribute_unit", value: "Unidad del Atributo" },
        { name: "actions", value: "Acciones" }
    ]

    async function fetchAttributesFiltered() {
        setLoading(true);
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getAttributesFiltered({orderBy, orderField, limit, page});
            setAttributesList(response.data);
            setPageTotal(response.totalRows); // Actualiza el total de elementos
        }catch (error) {
            console.error("Error fetching attribute:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAttributesFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    // El total de páginas debe ser calculado con el total de elementos
    const pageTotalToTable = Math.max(1, Math.ceil(pageTotal / limit));

    async function handleCreateAttributes(event: React.FormEvent<HTMLFormElement>, attribute: Attributes) {
        event.preventDefault();

        let error = null;
        let fieldError = null;

        const requiredFields: (keyof Attributes)[] = ["category_id", "attribute_name", "attribute_unit"];

        for (const field of requiredFields) {
            if (!attribute[field] || (attribute[field] as string).toString().trim() === "") {
                error = `El campo ${field} es obligatorio.`;
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
            if (selectedAttributes) {
                await updateAttributes(attribute);
            } else {
                await createAttributes(attribute);
            }

            await fetchAttributesFiltered();
            closeModal();
        } catch (error) {
            console.error("Error creating attribute:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAttributes(attributeId: string) {
        try{ 
            await deleteAttributes(attributeId);
            await fetchAttributesFiltered();
        }catch(error){
            console.error("Error deleting attribute:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDescAttributes) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: Attributes | null) => {
        setSelectedAttributes(data);
        openModal();
    };

    return (
        <>
            <ModalAttributes
                errorInput={errorInput}
                setErrorInput={setErrorInput}
                loading={loading}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedAttributes} 
                handleCreateAttributes={handleCreateAttributes} 
                selected={selectedAttributes} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<Attributes>
                titleTable=""
                buttonText="Agregar una nueva atributo"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThAttributes} 
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
                        attributeList && attributeList.length > 0 ? (
                            attributeList.map((attribute) => (
                                <TableRow key={attribute.id}>
                                    <TableCell className="px-3 py-3 text-left">#{attribute.id}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{attribute.category_name}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{attribute.attribute_name}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{attribute.attribute_unit}</TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(attribute)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleDeleteAttributes(attribute.id as string)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="text-center py-4" colSpan={12}>No se encontraron métodos de pago.</TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}