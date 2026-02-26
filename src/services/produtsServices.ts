import { orderBy, orderByAscDesc, Product } from "@/types/produts";

const URL_API: string = `${process.env.NEXT_PUBLIC_API_URL}products`;

interface FilterParams {
    categoryId?: number;
    filterlike?: string;
    orderBy?: orderBy | null;
    orderField?: orderByAscDesc | null;
    price_min?: number;
    price_max?: number;
    stock_min?: number;
    stock_max?: number;
    page?: number;
    limit?: number;
    discount_min?: number;
    discount_max?: number;
}

interface FilterResponse {
    total: number;
    products: Product[];
}

export async function getProductsFilter(Filterparams: FilterParams): Promise<FilterResponse> {

    const params = new URLSearchParams();

    if (Filterparams.categoryId) params.append("categoryId", Filterparams.categoryId.toString());
    if (Filterparams.page) params.append("page", Filterparams.page.toString());
    if (Filterparams.limit) params.append("limit", Filterparams.limit.toString());
    if (Filterparams.orderBy) {
        switch (Filterparams.orderBy) {
            case "ByPriceMinToMax":
                params.append("ByPriceMinToMax", "true");
                break;
            case "ByPriceMaxToMin":
                params.append("ByPriceMaxToMin", "true");
                break;
            case "novedades":
                params.append("novedades", "true");
                break;
            case "ByMostSold":
                params.append("ByMostSold", "true");
                break;
            case "ByNew":
                params.append("ByNew", "true");
                break;
            case "ByASC":
            case "ByDESC":
                if (Filterparams.orderField) {
                    params.append(Filterparams.orderBy, Filterparams.orderField);
                }
                break;
        }
        
    }
    if (Filterparams.filterlike) params.append("filterlike", Filterparams.filterlike);

    const response = await fetch(`${URL_API}/filter?${params.toString()}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error("Error fetching products");
    }
    return data;
}

export async function createProduct(product: Product, images: File[]): Promise<Product> {

    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("slug", product.slug);
    formData.append("description_long", product.description_long);
    formData.append("description_short", product.description_short);
    formData.append("category_id", String(product.category_id));
    formData.append("price", product.price.toString());
    formData.append("stock", String(product.stock));
    formData.append("idbrand", String(product.idbrand));
    formData.append("discount", String(product.discount));
    formData.append("image", product.image);

    images.forEach((file) => {
        formData.append("images", file);
    })

    const response = await fetch(URL_API, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error("Error creating product");
    }
    return data;
}

export async function updateProduct(product: Product): Promise<Product> {

    let formData = new FormData();

    formData.append("name", product.name);
    formData.append("slug", product.slug);
    formData.append("description_long", product.description_long);
    formData.append("description_short", product.description_short);
    formData.append("category_id", String(product.category_id));
    formData.append("price", product.price.toString());
    formData.append("stock", String(product.stock));
    formData.append("idbrand", String(product.idbrand));
    formData.append("discount", String(product.discount));
    formData.append("image", product.image);

    const response = await fetch(`${URL_API}/${product.id}`, {
      method: "PUT",
      body: formData
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error("Error updating product");
    }
    return data;
}

export async function deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
    })
    const data = await response.json()
    if (!response.ok || data.error) {
        throw new Error("Error deleting product");
    }
    return data;
}
