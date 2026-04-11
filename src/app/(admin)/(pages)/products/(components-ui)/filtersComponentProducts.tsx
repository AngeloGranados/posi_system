import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import FormRow from "@/components/form/group-input/FormRow";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { getCategoriesFiltered } from "@/services/categoriesServices";
import { Categories } from "@/types/categories";
import React, { useEffect } from "react";

interface FiltersComponentProps {
    onCategoryChange: (categoryId: string | null) => void;
    onStatusChange: (status: 'active' | 'inactive') => void;
}

const FiltersComponent: React.FC<FiltersComponentProps> = ({ onCategoryChange, onStatusChange }) => {

    const [categories, setCategories] = React.useState<{ value: string, label: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = React.useState<'active' | 'inactive'>('active');
    
    useEffect(() => {
        fetchCategories();
    }, [])

    useEffect(() => {
        onCategoryChange(selectedCategory);
    }, [selectedCategory]);

    useEffect(() => {
        onStatusChange(selectedStatus);
    }, [selectedStatus]);

    async function fetchCategories() {

        try {
            const response = await getCategoriesFiltered({ page: 1, limit: 1000 });
            const categoriesData = response.data.map((category: Categories) => ({
                value: category.id as string,
                label: category.name as string
            }));
            setCategories(categoriesData);
        }catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    return (
        <div className="flex gap-4 mb-4">
            <FormRow>
                <FormGroupInput>
                    <Label htmlFor="filterCategory">Filtrar por categoría</Label>
                    <Select 
                        name="filterCategory"
                        options={[
                            ...categories
                        ]}
                        value={selectedCategory || ''}
                        onChange={(e) => {
                            const selectedOption = e.target.value;
                            setSelectedCategory(selectedOption);
                        }}
                    />
                </FormGroupInput>
            </FormRow>
            <FormRow>
                <FormGroupInput>
                    <Label htmlFor="filterStatus">Filtrar por Estado</Label>
                    <Select 
                        name="filterStatus"
                        options={[
                            { value: "active", label: "Activo" },
                            { value: "inactive", label: "Inactivo" }
                        ]}
                        value={selectedStatus || ''}
                        onChange={(e) => {
                            const selectedOption = e.target.value;
                            setSelectedStatus(selectedOption as 'active' | 'inactive');
                        }}
                    />
                </FormGroupInput>
            </FormRow>
        </div>
    )
}

export default FiltersComponent;