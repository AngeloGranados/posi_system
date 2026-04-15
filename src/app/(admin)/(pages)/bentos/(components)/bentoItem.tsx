'use client'
import { getCategoriesFiltered } from '@/services/categoriesServices';
import './bentoItem.css'
import { Categories, filterOptions } from '@/types/categories';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import debounce from 'debounce';
import { CloseIcon, CloseLineIcon } from '@/icons';
import AddIcon from '../../../../../../public/images/icons/add-icon';
import CancelIcon from '../../../../../../public/images/icons/cancel-icon';

interface BentoItemProps {
    category: Categories | null;
    gridColumn: string;
    gridRow: string;
    backgroundImage?: string;
    children?: React.ReactNode;
    grid?: boolean;
    handleCategoryClick?: (category: Categories, index: number) => void;
    indexBento: number;
    handleClear: () => void;
    handleDeleteCategory: (index: number) => void;
}

export default function BentoItem({category, gridColumn, gridRow, backgroundImage, children, handleCategoryClick, indexBento, handleClear, handleDeleteCategory }: BentoItemProps) {

    const [filters, setFilters] = useState<filterOptions>({
        typeCategories: "Subcategories", 
        limit: 10,
        filterlike: ''
    } as filterOptions);

    const [categories, setCategories] = useState<Categories[] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const debounceInput = debounce((value: string) => {
        setFilters(prev => ({ ...prev, filterlike: value }));
    }, 300);

    useEffect(() => {
        debounceInput(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        const fetchData = async () => {
            const categories = await getCategoriesFiltered(filters) 
            setCategories(categories.data)
        }
        fetchData()
    }, [filters])


    return(
        <div className="relative group bento-item relative overflow-hidden" style={{ gridColumn: gridColumn, gridRow: gridRow, backgroundColor: "#378e44", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition : "center",  backgroundImage: backgroundImage,  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.1)", display: "flex", alignItems: "end", justifyContent: "center" }}>
            {
                category ? (
                    <button className='absolute top-2 right-2 z-4' onClick={() => handleDeleteCategory(indexBento)}><CancelIcon width={30} height={30} fill='red'/></button>
                ) : (
                    <span className='text-white font-bold absolute top-[50%] left-[50%] transform-[translateX(-50%)] z-10 text-center'>SELECCIONE UNA CATEGORIA</span>
                )
            }
            {
                category ? (
                    <>
                        <div className='absolute top-0 left-0 right-0 bg-gray-900 opacity-50 px-2 py-1 z-2 text-center group-hover:bg-black group-hover:opacity-80 transition duration-300'>
                            <span className='font-bold text-[1rem] text-white'>{category.name}</span>
                        </div>
                        <Image
                            unoptimized={process.env.NODE_ENV ? true : false}
                            src={`${backgroundImage ? backgroundImage : "/images/404_image.png"}`} 
                            alt={category.name ? category.name : "Imagen de fondo"}
                            width={1276}
                            height={1680}
                            className="absolute top-[50%] left-[50%] w-[119%] h-[119%] object-contain pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                        />
                        <div className="category-body max-w-[calc(100%-80px)]">
                            {children}
                        </div>
                        <div className="bento-item-overlay"></div>
                    </>
                ) : (
                    <div className='bg-white/80 absolute top-0 left-0 right-0 bottom-0 opacity-0 group-hover:opacity-100 transition duration-300 p-4 overflow-y-auto z-10'>
                        <div>
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='bg-white text-gray-600 rounded-lg p-2 w-full mb-5' placeholder='Search...' />
                        </div>
                        <ul>
                            {
                                categories?.map((cat, index) => (
                                    <button type='button' className='d-block w-full flex flex-col items-center justify-center' key={index} onClick={() => handleCategoryClick?.(cat, indexBento)}>
                                        <li key={cat.id} className='w-full group/item bg-gray-200 mb-4 overflow-hidden cursor-pointer'>
                                            <p className='text-[1rem] font-bold text-center text-white bg-red-500'>{cat.name}</p>
                                            <div className='w-full h-40 mb-2 flex overflow-hidden items-center justify-center'>
                                                <Image className='group-hover/item:scale-105 w-full h-full object-cover' unoptimized={process.env.NODE_ENV ? true : false} src={`${process.env.NEXT_PUBLIC_URL_IMAGES}categories/${cat.image_url}`} alt={cat.name} width={100} height={100} />
                                            </div>
                                        </li>
                                    </button>
                                ))
                            }
                        </ul>
                    </div>
                )
            }
        </div>
    )
}