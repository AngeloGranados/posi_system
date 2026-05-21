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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { orderByAscDescTestimonios, orderByTestimonios, statusTestimonios, tableThTestimonios, Testimonios } from "@/types/testimonios";
import { getTestimoniosFiltered, updateStatusTestimonio } from "@/services/testimoniosServices";
import { formatDate } from "../../../../../../util";
import FiltersComponentTestimonio from "./filtersComponentShippingMethods";
import Badge from "@/components/ui/badge/Badge";
import Select from "@/components/form/Select";

const SweetAlert = withReactContent(Swal);

export default function TableModal() {

    const [testimonioList, setTestimoniosList] = useState<Testimonios[]>([]);

    // filters
    const [filters, setFilters] = useState({
        page: 1,
        limit: 100,
        orderBy: "ByDESC" as orderByTestimonios,
        orderField: "id" as orderByAscDescTestimonios,
        filterlike: '',
        byStatus: 'pending' as 'pending' | 'approved' | 'rejected'
    });

    const [pageTotal, setPageTotal] = useState(1);

    const [loading, setLoading] = useState(false);

    const tableThTestimonios: tableThTestimonios[] = [
        { name: "id", value: "ID" },
        { name: "name", value: "Autor" },
        { name: "rating", value: "Calificación" },
        { name: "type", value: "Tipo" },
        { name: "comment", value: "Comentario" },
        { name: "status", value: "Estado" },
        { name: "created_at", value: "Creado El" },
        { name: "updated_at", value: "Actualizado El" },
        { name: "actions", value: "Acciones" }
    ]

    async function fetchTestimoniosFiltered() {
        setLoading(true);
        try {
            const response = await getTestimoniosFiltered({orderBy: filters.orderBy, orderField: filters.orderField, limit: filters.limit, page: filters.page, byStatus: filters.byStatus});
            setTestimoniosList(response.rows);
            setPageTotal(response.total); // Actualiza el total de elementos
        } catch (error) {
            console.error("Error fetching testimonio:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTestimoniosFiltered()
    }, [filters]);

    // El total de páginas debe ser calculado con el total de elementos
    const pageTotalToTable = Math.max(1, Math.ceil(pageTotal / filters.limit));

    async function handleOrderByAscDesc(field: orderByAscDescTestimonios) {
        if(filters.orderField === field){       
            setFilters(prev => ({
                ...prev,
                orderBy: prev.orderBy === "ByASC" ? "ByDESC" : "ByASC"
            }))
        } else {
            setFilters(prev => ({
                ...prev,
                orderField: field,
                orderBy: "ByASC"
            }));
        }
    }

    function handleChangeStatus(status: statusTestimonios) {
        setFilters(prev => ({
            ...prev,
            byStatus: status
        }))
    }

    const handleChangeStatusTestimonio = (id: string) => async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as statusTestimonios;

        if (newStatus === "" as statusTestimonios) {
            return;
        }

        Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Quieres cambiar el estado del testimonio a "${newStatus}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateStatusTestimonio(id, newStatus);
                    await fetchTestimoniosFiltered(); // Refresca la lista después de actualizar el estado
                    SweetAlert.fire({
                        title: "Éxito",
                        text: "El estado del testimonio ha sido actualizado.",
                        icon: "success",
                        confirmButtonText: "Aceptar"
                    });
                } catch (error) {
                    SweetAlert.fire({
                        title: "Error",
                        text: "Hubo un error al actualizar el estado del testimonio.",
                        icon: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            }
        });
    };

    return (
        <>
            {/* <ModalTestimonios
                errorInput={errorInput}
                setErrorInput={setErrorInput}
                loading={loading}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedTestimonios} 
                handleCreateTestimonios={handleCreateTestimonios} 
                selected={selectedTestimonios} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            /> */}
            <TablePage<Testimonios>
                titleTable=""
                buttonText=""
                filters={<FiltersComponentTestimonio onStatusChange={handleChangeStatus} />}
                orderField={filters.orderField} 
                orderBy={filters.orderBy} 
                tableThPage={tableThTestimonios}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                page={filters.page}
                setPage={(page) => setFilters(prev => ({ ...prev, page }))}
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
                        testimonioList && testimonioList.length > 0 ? (
                            testimonioList.map((testimonio) => (
                                <TableRow key={testimonio.id}>
                                    <TableCell className="px-3 py-3 text-left">#{testimonio.id}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{testimonio.name}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{testimonio.rating}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{testimonio.type}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{testimonio.comment}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <Badge
                                            variant="light"
                                            color={testimonio.status === 'approved' ? 'success' : testimonio.status === 'rejected' ? 'error' : 'warning'}
                                        >{testimonio.status}</Badge>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">{testimonio.updated_at ? formatDate(String(testimonio.updated_at)) : ''}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{testimonio.created_at ? formatDate(String(testimonio.created_at)) : ''}</TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Select
                                             options={[
                                                { value: "approved", label: "Aprobar" },
                                                { value: "rejected", label: "Rechazar" },
                                                { value: "pending", label: "Pendiente" }
                                             ]}
                                             onChange={handleChangeStatusTestimonio(testimonio.id as string)}
                                             value={testimonio.status}
                                            >

                                            </Select>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="text-center py-4" colSpan={12}>No se encontraron testimonios.</TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}