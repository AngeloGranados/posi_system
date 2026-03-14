'use client'

import { useModal } from "@/hooks/useModal"
import { useEffect, useState } from "react";
import useAlert from "@/hooks/useAlert";
import TablePage from "@/components/tables/TablePage";
import { TableRow, TableCell } from "@/components/ui/table";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import EditIcon from "../../../../../../public/images/icons/edit-icon";
import Button from "@/components/ui/button/Button";
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";
import { orderByAscDescUsers, orderByUsers, Users, tableThUsers } from "@/types/users";
import Badge from "@/components/ui/badge/Badge";
import { changePassword, createUsers, deleteUsers, getUsersFiltered, updateUsers } from "@/services/usersServices";
import ModalUsers from "./modalUsers";
import { UserIcon } from "@/icons";
import { formatDate } from "@fullcalendar/core/index.js";
import { formatTelephone } from "../../../../../../util";

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedUsers, setSelectedUsers] = useState<Users | null>(null);
    const [userList, setUsersList] = useState<Users[]>([]);

    // CONTRASEÑA UPDATE
    const [isToChangePassword, setIsToChangePassword] = useState(false);
    const [newContraseña, setNewContraseña] = useState("");
    const [confirmContraseña, setConfirmContraseña] = useState("");

    // filters
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [pageTotal, setPageTotal] = useState(1)
    const [orderBy, setOrderBy] = useState<orderByUsers>("ByDESC")
    const [orderField, setOrderField] = useState<orderByAscDescUsers>("id")
    const [filterlike, setFilterlike] = useState('')

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()
    const [ errorInput, setErrorInput ] = useState<string | null>(null)

    const tableThUsers: tableThUsers[] = [
        { name: "id", value: "ID" },
        { name: "nombres", value: "Nombres" },
        { name: "telefono", value: "Teléfono" },
        { name: "type", value: "Tipo" },
        { name: "created_at", value: "Creado" },
        { name: "updated_at", value: "Actualizado" },
        { name: "is_active", value: "Estado" },
    ]

    async function fetchUsersFiltered() {
        setLoading(true);
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getUsersFiltered({orderBy, orderField, limit, page});
            setUsersList(response.data);
            setPageTotal(response.totalRows); // Actualiza el total de elementos
        }catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsersFiltered()
    }, [limit, page, orderBy, filterlike, orderField]);

    // El total de páginas debe ser calculado con el total de elementos
    const pageTotalToTable = Math.max(1, Math.ceil(pageTotal / limit));

    async function handleCreateUsers(event: React.FormEvent<HTMLFormElement>, user: Users) {
        event.preventDefault();

        let error = null;
        let fieldError = null;

        const requiredFields: (keyof Users)[] = ["nombres", "apellidos", "telefono", "type", "password_hash"];

        for (const field of requiredFields) {
            if (!user[field] || (user[field] as string).toString().trim() === "") {
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
            if (selectedUsers) {
                if (isToChangePassword) {
                    if (newContraseña !== confirmContraseña) {
                        triggerAlert("Error", "Las contraseñas no coinciden", "error");
                        return;
                    }

                    await changePassword({ 
                        idUser: selectedUsers.id as string,
                        newPassword: newContraseña
                    })
                }

                await updateUsers(user);
            } else {
                await createUsers(user);
            }

            await fetchUsersFiltered();
            closeModal();
        } catch (error) {
            triggerAlert("Error", error instanceof Error ? error.message : "Error desconocido", "error");
        }
    }

    async function handleDeleteUsers(userId: string) {
        try{ 
            await deleteUsers(userId);
            await fetchUsersFiltered();
        }catch(error){
            console.error("Error deleting user:", error);
        }
    } 

    async function handleOrderByAscDesc(field: orderByAscDescUsers) {
        if(orderField === field){
            setOrderBy(orderBy === "ByASC" ? "ByDESC" : "ByASC");
        } else {
            setOrderField(field);
            setOrderBy("ByASC");
        }
    }

    const handleOpenModal = (data: Users | null) => {
        setSelectedUsers(data);
        openModal();
    };

    return (
        <>
            <ModalUsers 
                errorInput={errorInput}
                setErrorInput={setErrorInput}
                loading={loading}
                isToChangePassword={isToChangePassword}
                newContraseña={newContraseña}
                confirmContraseña={confirmContraseña}
                setIsToChangePassword={setIsToChangePassword}
                setNewContraseña={setNewContraseña}
                setConfirmContraseña={setConfirmContraseña}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedUsers} 
                handleCreateUsers={handleCreateUsers} 
                selected={selectedUsers} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<Users>
                titleTable=""
                buttonText="Agregar un Usuario"
                orderField={orderField} 
                orderBy={orderBy} 
                tableThPage={tableThUsers} 
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
                        userList && userList.length > 0 ? (
                            userList.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="px-3 py-3 text-left">#{user.id}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div className="flex items-center gap-3">
                                            <UserIcon />
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.nombres}</span>
                                                <small className="text-gray-500">{user.email}</small>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">{formatTelephone(user.telefono)}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        {user.type === "admin" ? (
                                            <Badge variant="solid" color="primary">Administrador</Badge>
                                        ) : (
                                            <Badge variant="solid" color="info">Cliente</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div className="flex flex-col">
                                            <span>{user.created_at ? formatDate(user.created_at) : ""}</span>
                                            <small className="text-gray-500"> {user.created_at ? formatDate(user.created_at, { timeZone: 'UTC', hour: 'numeric', minute: 'numeric' }) : ""}</small>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div className="flex flex-col">
                                            <span>{user.updated_at ? formatDate(user.updated_at) : ""}</span>
                                            <small className="text-gray-500"> {user.updated_at ? formatDate(user.updated_at, { timeZone: 'UTC', hour: 'numeric', minute: 'numeric' }) : ""}</small>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        {
                                        user.is_active ? 
                                            <Badge variant="solid" color="success">Activo</Badge> : 
                                            <Badge variant="solid" color="error">Inactivo</Badge>
                                        }
                                    </TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(user)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleDeleteUsers(user.id as string)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                           <TableRow>
                               <TableCell className="text-center py-4" colSpan={12}>
                                   No hay resultados
                               </TableCell>
                           </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}