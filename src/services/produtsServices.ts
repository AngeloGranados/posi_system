import { CategoryAttribute, ImagesProduct, orderByAscDescProduct, orderByProduct, Product, ProductAttribute } from "@/types/produts";

const URL_API: string = `${process.env.NEXT_PUBLIC_API_URL}products`;

interface FilterParams {
    categoryId?: number;
    filterlike?: string;
    orderBy?: orderByProduct | null;
    orderField?: orderByAscDescProduct | null;
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
        throw new Error(data.error || "Error creating product");
    }
    return data;
}

export async function createProduct(product: Product, images: File[] | string[], productAttributes: { key: number; value: string }[] ): Promise<Product> {

    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("sku", product.sku);
    formData.append("slug", product.slug);
    formData.append("description_long", product.description_long);
    formData.append("description_short", product.description_short);
    formData.append("category_id", String(product.category_id));
    formData.append("price", product.price.toString());
    formData.append("stock", String(product.stock));
    formData.append("idbrand", String(product.idbrand));
    formData.append("discount", String(product.discount));
    formData.append("image", product.image);
    formData.append("product_attributes", JSON.stringify(productAttributes || []));
    
    images.forEach((file) => {
        formData.append("images", file);
    })

    const response = await fetch(URL_API, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error || "Error creating product");
    }
    return data;
}

export async function updateProduct(product: Product, images: File[] | string[], productAttributes: { key: number; value: string }[]): Promise<Product> {

    let formData = new FormData();

    formData.append("name", product.name);
    formData.append("sku", product.sku);
    formData.append("slug", product.slug);
    formData.append("description_long", product.description_long);
    formData.append("description_short", product.description_short);
    formData.append("category_id", String(product.category_id));
    formData.append("price", product.price.toString());
    formData.append("stock", String(product.stock));
    formData.append("idbrand", String(product.idbrand));
    formData.append("discount", String(product.discount));
    formData.append("image", product.image);
    formData.append("product_attributes", JSON.stringify(productAttributes || []));
    
    if(images && images.length > 0) {
        if( typeof images[0] === "string") {
            formData.append("images", JSON.stringify(images));
        } else if (images[0] instanceof File && images[0].size > 0) {
            images.forEach((file) => {
                formData.append("images", file);
            });
        }
    }

    const response = await fetch(`${URL_API}/${product.id}`, {
      method: "PUT",
      body: formData
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
    })
    const data = await response.json()
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data;
}

export async function getImagesByProductId(productId: number): Promise<ImagesProduct[]> {
    const response = await fetch(`${URL_API}/images/${productId}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data || [];
}

export async function getAttributesByProductId(productId: number): Promise<ProductAttribute[]> {
    const response = await fetch(`${URL_API}/attributes/${productId}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data || [];
}

export async function getCategoryAttributesByCategoryId(categoryId: number): Promise<CategoryAttribute[]> {
    const response = await fetch(`${URL_API}/categoryAttributesByCategoryId/${categoryId}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(data.error);
    }
    return data || [];
}