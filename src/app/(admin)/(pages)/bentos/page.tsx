'use client'
import { useState } from "react";
import BentoItem from "./(components)/bentoItem";
import { Categories } from "@/types/categories";
import { configBentoCategories } from "@/services/dashboardServices";
import { useRouter } from "next/navigation";


export default function Bentos() {
    
    const router = useRouter();
    const [categoriesFill, setCategoriesFill] = useState<Array<Categories | null>>(Array(8).fill(null))

    const bentoCategoriesSpan = [
        { gridColumn: "span 1", gridRow: "span 10", image_url: "/images/bentos/Posi_1.png" }, //Primera grilla
        { gridColumn: "span 1", gridRow: "span 10", image_url: "/images/bentos/Posi_2.png" }, //Segunda grilla
        { gridColumn: "span 1", gridRow: "span 13", image_url: "/images/bentos/Posi_x_Rascón.png" }, //Tercera grilla
        { gridColumn: "span 1", gridRow: "span 8", image_url: "/images/bentos/Posi_4_2.png" }, //Cuarta grilla (El del medio)
        { gridColumn: "span 1", gridRow: "span 8", image_url: "/images/bentos/O_20251102_222336_0000.png" }, //Quinta grilla (Abajo de la primera)
        { gridColumn: "span 1", gridRow: "span 13", image_url: "/images/bentos/InShot_20250320_104409217.jpg" }, //Sexta grilla (Abajo de la quinta)
        { gridColumn: "span 1", gridRow: "span 8", image_url: "/images/bentos/9.png" }, //Séptima grilla (Abajo de la tercera)
        { gridColumn: "span 1", gridRow: "span 8", image_url: "/images/bentos/Posi_3.png" }, //Octava grilla (Abajo de la segunda)
    ]

    function handleCategoryClick(category: Categories, index: number) {
        if (categoriesFill.some((cat, i) => cat?.id === category.id && i !== index)) {
            alert("La categoría ya está asignada a esta posición. Por favor, selecciona otra categoría.")
        } else {
            setCategoriesFill(prev => {
                const newCategories = [...prev];
                newCategories[index] = category;
                return newCategories;
            });
        }
    }

    async function saveConfiguration() {
        try {
            if (categoriesFill.some((cat, i) => cat == null)) {
                alert("Hay posiciones sin asignar. Por favor, asigna una categoría a cada posición antes de guardar.");
                return;
            }
            const response = await configBentoCategories(categoriesFill as Categories[]);
            if (response.message) {
                alert(response.message);
                handleClear();
            }
        } catch (error) {
            console.error("Error al guardar la configuración:", error);
        }
    }

    function handleClear() {
        setCategoriesFill(Array(8).fill(null));
    }

    function handleDeleteCategory(index: number) {
        setCategoriesFill(prev => {
            const newCategories = [...prev];
            newCategories[index] = null;
            return newCategories;
        });
    }

    return (
        <div>
            <div className="p-10 bg-white rounded-lg shadow-md">
                <div className="flex justify-end">
                    <button onClick={handleClear} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600 transition duration-300">Limpiar</button>
                </div>
                <h1 className="text-2xl font-bold mb-4">Configuración - Plantilla</h1>
                <div className="container-categories" style={{ display: "flex", height: "800px", width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <div className="grid" style={{ display: "grid", height: "100%", width: "100%", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(25, 1fr)", gap: "16px", borderRadius: "8px" }}>
                        {
                            categoriesFill.map((category, index) => (
                                <BentoItem handleDeleteCategory={handleDeleteCategory} handleClear={handleClear} indexBento={index} handleCategoryClick={handleCategoryClick} key={`${category?.id}-${index}-${category?.name}`} category={category} gridColumn={bentoCategoriesSpan[index].gridColumn} gridRow={bentoCategoriesSpan[index].gridRow} backgroundImage={`${process.env.NEXT_PUBLIC_URL_IMAGES}categories/${category ? category.image_url : ""}`}>
                                    <p className='text-[0.82rem]'>{category?.description}</p>
                                </BentoItem>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
               <button onClick={saveConfiguration} className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600 transition duration-300">Guardar Configuración</button>         
            </div>
        </div>
    )
}