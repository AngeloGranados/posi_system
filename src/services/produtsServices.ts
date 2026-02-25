import { Product } from "@/types/produts";

const URL_API: string = `${process.env.NEXT_PUBLIC_API_URL}products`;

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(URL_API);
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
