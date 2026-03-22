import Form from "@/components/form/Form";
import { ImagesProducts, orderByAscDescImagesProducts, orderByImagesProducts } from "@/types/images_products";

const URL_API = `${process.env.NEXT_PUBLIC_API_URL}images_products`;

interface filterOptions {
    orderField: orderByAscDescImagesProducts;
    orderBy: orderByImagesProducts;
    limit: number;
    page: number;
}

export async function getImagesProducts(): Promise<ImagesProducts[]> {
    const response = await fetch(`${URL_API}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function deleteImagesProducts(imagesProductId: string): Promise<void> {
    const response = await fetch(`${URL_API}/${imagesProductId}`, {
        method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function updateImagesProducts(imagesProduct: ImagesProducts): Promise<ImagesProducts> {

    const formData = new FormData();

    formData.append("product_id", imagesProduct.product_id);
    formData.append("alt_text", imagesProduct.alt_text);
    formData.append("sort_order", imagesProduct.sort_order.toString());
    formData.append("attribute_value", imagesProduct.attribute_value);
    formData.append("image_url", imagesProduct.image_url);

    const response = await fetch(`${URL_API}/${imagesProduct.id}`, {
        method: "PUT",
        body: formData
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function createImagesProducts(imagesProduct: ImagesProducts): Promise<ImagesProducts> {

    const dataToFetch = new FormData();

    dataToFetch.append("product_id", imagesProduct.product_id);
    dataToFetch.append("alt_text", imagesProduct.alt_text);
    dataToFetch.append("sort_order", imagesProduct.sort_order.toString());
    dataToFetch.append("attribute_value", imagesProduct.attribute_value);

    if (imagesProduct.image_url instanceof File && imagesProduct.image_url.size > 0) {
        dataToFetch.append("image_url", imagesProduct.image_url);
    }

    const response = await fetch(`${URL_API}`, {
        method: "POST",
        body: dataToFetch
    });

    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getImagesProductsFiltered(filterOptions: filterOptions): Promise<{ data: ImagesProducts[]; totalRows: number}>{

    const params = new URLSearchParams();

    if(filterOptions.limit) params.append("limit", filterOptions.limit.toString());
    if(filterOptions.page) params.append("page", filterOptions.page.toString());
    if(filterOptions.orderBy){
        switch (filterOptions.orderBy) {
            case "ByASC":
            case "ByDESC":
                if (filterOptions.orderField) {
                    params.append(filterOptions.orderBy, filterOptions.orderField);
                }
        }
    }

    const response = await fetch(`${URL_API}/filter?${params.toString()}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}
