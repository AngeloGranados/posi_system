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
import ModalBlog from "./modalBlog";
import { Blog, orderByAscDescBlog, orderByBlog, tableThBlog } from "@/types/blog";
import { createBlog, deleteBlog, getBlogFiltered, updateBlog } from "@/services/blogServices";
import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";

const SweetAlert = withReactContent(Swal);

export default function TableModal() {
    const { isOpen, closeModal, openModal } = useModal();
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [blogList, setBlogList] = useState<Blog[]>([]);

    // filters
    const [filters, setFilters] = useState({
        page: 1,
        limit: 100,
        orderBy: "byDESC" as orderByBlog,
        orderField: "id" as orderByAscDescBlog,
        filterlike: ""
    });
    const [pageTotal, setPageTotal] = useState(1)

    const [loading, setLoading] = useState(false);

    // Alert
    const { showAlert, alertMessage, alertVariant, alertTitle, triggerAlert, closeAlert } = useAlert()
    const [ errorInput, setErrorInput ] = useState<string | null>(null)

    const tableThBlog: tableThBlog[] = [
        { name: "id", value: "ID" },
        { name: "title", value: "Post" },
        { name: "author", value: "Autor" },
        { name: "published_at", value: "Publicado el" },
        { name: "created_at", value: "Creado el" },
        { name: "is_published", value: "Estado" },
        { name: "actions", value: "Acciones" }
    ]

    async function fetchBlogFiltered() {
        setLoading(true);
        try {
            // El servicio debe retornar { data, totalItems }
            const response = await getBlogFiltered(filters);
            setBlogList(response.data);
            setPageTotal(response.total); // Actualiza el total de elementos
        }catch (error) {
            console.error("Error fetching blog:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBlogFiltered()
    }, [filters]);

    // El total de páginas debe ser calculado con el total de elementos
    const pageTotalToTable = Math.max(1, Math.ceil(pageTotal / filters.limit));

    async function handleCreateBlog(event: React.FormEvent<HTMLFormElement>, blog: Blog) {
        event.preventDefault();

        let error = null;
        let fieldError = null;

        const requiredFields: (keyof Blog)[] = ["author", "title", "slug", "content", "published_at", "image_url", "summary"];

        for (const field of requiredFields) {
            if (!blog[field] || (blog[field] as string).toString().trim() === "") {
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
            if (selectedBlog) {
                await updateBlog(blog);
            } else {
                await createBlog(blog);
            }

            await fetchBlogFiltered();
            closeAlert();
            closeModal();
        } catch (error) {
            console.error("Error creating blog:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteBlog(blogId: string) {
        
        SweetAlert.fire({
            title: "¿Estás seguro?",
            text: "Este registro sera eliminado permanentemente y podria borrar toda la información relacionada a este.",
            icon: "warning",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteBlog(blogId);
                    SweetAlert.fire("¡Eliminado!", "El atributo ha sido eliminado.", "success");
                    await fetchBlogFiltered();
                } catch (error) {
                    console.error("Error deleting blog:", error);
                }
            }
        })
    } 

    async function handleOrderByAscDesc(field: orderByAscDescBlog) {
        if(filters.orderField === field){
            setFilters({...filters, orderBy: filters.orderBy === "byASC" ? "byDESC" : "byASC"});
        } else {
            setFilters({...filters, orderField: field, orderBy: "byASC"});
        }
    }

    const handleOpenModal = (data: Blog | null) => {
        setSelectedBlog(data);
        openModal();
    };

    return (
        <>
            <ModalBlog
                errorInput={errorInput}
                setErrorInput={setErrorInput}
                loading={loading}
                isOpen={isOpen} 
                closeModal={closeModal} 
                setSelected={setSelectedBlog} 
                handleCreateBlog={handleCreateBlog} 
                selected={selectedBlog} 
                alertProps={{ showAlert, alertMessage, alertVariant, alertTitle, closeAlert }} 
            />
            <TablePage<Blog>
                titleTable=""
                buttonText="Agregar un nuevo post"
                orderField={filters.orderField} 
                orderBy={filters.orderBy} 
                tableThPage={tableThBlog} 
                OpenModal={handleOpenModal}  
                handleOrderByAscDesc={handleOrderByAscDesc} 
                pageTotal={pageTotalToTable} 
                page={filters.page}
                setPage={(page) => setFilters({...filters, page})}
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
                        blogList && blogList.length > 0 ? (
                            blogList.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell className="px-3 py-3 text-left">#{blog.id}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">
                                        <div className="flex items-center space-x-4">
                                            <div className="mb-2">
                                                {
                                                    blog.image_url && (
                                                    <Image
                                                        width={64}
                                                        height={64}
                                                        unoptimized={process.env.NODE_ENV ? true : false}
                                                        src={`${process.env.NEXT_PUBLIC_URL_IMAGES ?? ""}blog/${typeof blog.image_url === "string" ? blog.image_url : blog.image_url}`}
                                                        alt={blog.title}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    )
                                                }
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[17px] font-bold">{blog.title}</span>
                                                <small className="text-gray-800">{blog.slug}</small>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-3 py-3 text-left">{blog.author}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{blog.published_at ? new Date(blog.published_at).toLocaleDateString() : "No publicado"}</TableCell>
                                    <TableCell className="px-3 py-3 text-left">{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : "No publicado"}</TableCell>
                                    <TableCell className="px-3 py-3 text-left text-gray-500">
                                        {blog.is_published ? <Badge color="success" variant="light">Publicado</Badge> : <Badge color="warning" variant="light">No publicado</Badge>}
                                    </TableCell>
                                    <TableCell className="px-3 py-3">
                                        <div className="flex space-x-4">
                                            <Button onClick={() => handleOpenModal(blog)} variant="outline" className="text-blue-500"><EditIcon width={16} height={16} fill="currentColor" /></Button>
                                            <Button onClick={() => handleDeleteBlog(blog.id as string)} variant="outline" className="text-red-500"><DeleteIcon width={16} height={16} fill="currentColor" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="text-center py-4" colSpan={12}>No se encontraron posts registrados.</TableCell>
                            </TableRow>
                        )
                    )
                }
            </TablePage>
        </>
    );
}