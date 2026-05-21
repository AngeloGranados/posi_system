
import { filterOptions, Testimonios } from "@/types/testimonios";

const URL_API = `${process.env.NEXT_PUBLIC_API_URL}reviews`;

export async function getTestimoniosFiltered(filterOptions: filterOptions): Promise<{ rows: Testimonios[]; total: number }> {

    const queryParams = new URLSearchParams()

    queryParams.append("limit", filterOptions.limit.toString());
    queryParams.append("page", filterOptions.page.toString());
    if (filterOptions.orderBy) {
        switch (filterOptions.orderBy) {
            case "ByASC":
            case "ByDESC":
                if (filterOptions.orderField) {
                    queryParams.append(filterOptions.orderBy, filterOptions.orderField);
                }
        }
    }
    queryParams.append("orderField", filterOptions.orderField);
    queryParams.append("byStatus", filterOptions.byStatus);

    const response = await fetch(`${URL_API}/filter?${queryParams.toString()}`);
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(`Error fetching testimonios filtered ${data.error}`);
    }
    return data;
}

export async function updateStatusTestimonio(id: string, status: string): Promise<Testimonios> {
    const response = await fetch(`${URL_API}/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok || data.error) {
        throw new Error(`Error updating testimonio status ${data.error}`);
    }
    return data;
}
