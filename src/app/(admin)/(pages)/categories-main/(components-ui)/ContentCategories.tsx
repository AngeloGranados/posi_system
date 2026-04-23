'use client'

import { configCategoriesProductRelevantNews, getCategoriesFiltered } from "@/services/categoriesServices";
import { Categories, filterOptions } from "@/types/categories";
import debounce from "debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";
import CancelIcon from "../../../../../../public/images/icons/cancel-icon";

const swalAlert = withReactContent(Swal);

export default function ContentCategories() {
    const [categoriesMains, setCategoriesMains] = useState<(Categories | null)[]>(Array(4).fill(null));
    const [selectedCategoryIndex, setSelectedCategory] = useState<number | null>(null);
    const [categoriesFiltered, setCategoriesFiltered] = useState<Categories[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [filters, setFilters] = useState<filterOptions>({limit: 10, filterlike: "", typeCategories: "Subcategories"} as filterOptions);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setSelectedCategory(null);
            }
        }

        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    function handleCategoryClick(index: number) {
        setSelectedCategory(index);
    }

    const debounceCategoriesFilter = useCallback(debounce((value:string) => {
        setFilters((prevFilters) => ({ ...prevFilters, filterlike: value }));
    }, 500), []);

    useEffect(() => {
        fetchCategories();
    }, [filters]);

    useEffect(() => {
        debounceCategoriesFilter(inputValue);
    }, [inputValue]);

    async function fetchCategories() {
        try {
            const response = await getCategoriesFiltered(filters);
            setCategoriesFiltered(response.data);
        }catch (error) {
            console.error("Error fetching categories:", error);
        }
    } 

    function handleCategoryDelete(index: number) {
        const newCategoriesMains = [...categoriesMains];
        newCategoriesMains[index] = null;
        setCategoriesMains(newCategoriesMains);
    }

    function handleAddCategory(category: Categories) {
        if (selectedCategoryIndex !== null) {
            const newCategoriesMains = [...categoriesMains];
            if (categoriesMains.some(cat => cat?.id === category.id)) {
                alert("Esta categoría ya ha sido seleccionada en otra posición. Por favor, elija una categoría diferente.");
                return;
            }
            newCategoriesMains[selectedCategoryIndex] = category;
            setCategoriesMains(newCategoriesMains);
            setSelectedCategory(null);
        }
    }

    function handleDiscardChanges() {

        swalAlert.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas descartar los cambios realizados en la configuración de categorías para la página principal?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, descartar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                handleClear();
            }
        });
    }

    function handleClear() {
        setCategoriesMains(Array(4).fill(null));
        setCategoriesFiltered([]);
        setInputValue("");
        setFilters({limit: 10, filterlike: "", typeCategories: "Subcategories"} as filterOptions);
        setSelectedCategory(null);
    }

    async function handleSaveConfiguration() {

        if (categoriesMains.some(category => category === null)) {
            alert("Por favor, complete todas las categorías antes de guardar la configuración.");
            return;
        }

        swalAlert.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas guardar esta configuración de categorías para la página principal?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const categoriesIds = categoriesMains.map(category => category?.id as string);
                    const response = await configCategoriesProductRelevantNews(categoriesIds);
                    handleClear();
                    alert(response.message);
                } catch (error) {
                    console.error("Error saving configuration:", error);
                }
            }
        });
    }


    return (
        <div>
            <div className="flex items-center justify-end mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={handleSaveConfiguration} className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">Guardar Configuración</button>
                    <button className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600" onClick={handleDiscardChanges}>Descartar</button>
                </div>
            </div>
            <div className="flex items-center flex-col gap-6 max-w-2xl mx-auto border border-gray-300 rounded-lg p-6">
                {
                    categoriesMains.map((category, index) => {
                        if (!category) {
                        return <div className="flex relative items-center justify-center w-2/4 h-40 rounded-lg border border-gray-300 p-4 hover:bg-gray-200 cursor-pointer" key={index} onClick={() => handleCategoryClick(index)}>
                            <span className="text-gray-600">Seleccione una categoría</span>
                            { selectedCategoryIndex === index && <div ref={containerRef} className="absolute overflow-y-auto z-10 p-4 -top-10 left-70 w-full h-80 bg-white bg-opacity-90 flex flex-col items-center transition-opacity rounded-lg">
                                <input onChange={(e) => setInputValue(e.target.value)} type="text" className="border border-gray-300 rounded-lg p-2 mt-2 w-full" placeholder="Nombre de la categoría" />
                                <div>
                                    {
                                        categoriesFiltered.length > 0 ? categoriesFiltered.map((category) => (
                                            <div className="flex items-center gap-2 mt-4 bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200" key={category.id} onClick={() => handleAddCategory(category)}>
                                                <img src={`${process.env.NEXT_PUBLIC_URL_IMAGES}categories/${category.image_url}`} alt={category.name} className="w-4 h-4 object-cover" />
                                                <div>
                                                    <span className="text-gray-600">{category.name}</span>
                                                </div>
                                            </div>
                                        )) : <p className="text-gray-600 mt-4">No se encontraron categorías</p>
                                    }
                                </div>
                            </div>}
                        </div>
                        } else {
                            return <div className="relative flex items-center gap-4 w-2/4 h-40 rounded-lg border border-gray-300 p-4" key={index}>
                                <div>
                                    <span className="text-gray-800 font-semibold">{category.name}</span>
                                </div>
                                <div className="absolute p-2 bg-white top-5 right-5 cursor-pointer hover:bg-gray-100" onClick={() => handleCategoryDelete(index)}>
                                    <CancelIcon width={20} height={20} fill="red"/>
                                </div>
                            </div>;
                        }
                    })
                }
            </div>
        </div>
    )
}