import Image from "next/image";
import AddIcon from "../../../../public/images/icons/add-icon";
import { Discounts } from "@/types/discounts";
import { Product } from "@/types/produts";

interface InputContainerProductProps {
    products: Product[];
    is_open: boolean;
    loading?: boolean;
    handleProductInputChange?: (producto: Product) => void;
}

export function InputContainerProduct({ products, is_open = false, loading, handleProductInputChange }: InputContainerProductProps) {
    return (
        <div className={`absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 ${is_open ? "block" : "hidden"}`}>
          <div className="p-5 flex flex-col gap-3 max-h-60 overflow-y-auto custom-scrollbar">
            {
                loading ? (
                    <div className="flex flex-col items-center gap-3 py-5">
                        <span className="text-gray-500">Cargando productos...</span>
                    </div>
                ) : products.length > 0 ? products.map((product) => (
                    <button onClick={() => handleProductInputChange?.(product)} key={product.id} type="button" className="flex items-center gap-5 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <div className="w-[60px] h-[60px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        <Image unoptimized={process.env.NODE_ENV ? true : false} src={product.image ? `${process.env.NEXT_PUBLIC_URL_IMAGES}${product.image}` : "/images/error/404_image.png"} width={100} height={100} alt="Imagen de producto" />
                    </div>
                    <div className="flex flex-1 flex-col">
                        <span>{product.name}</span>
                        <small>{product.category_name}</small>
                    </div>
                    <div>
                        <AddIcon width={24} height={24} />
                    </div>
                    </button>
                )) : (
                    <div className="flex flex-col items-center gap-3 py-5">
                        <span className="text-gray-500">No hay productos disponibles</span>
                    </div>
                )
            }
          </div>
        </div>
    )
}