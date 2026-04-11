import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import FormRow from "@/components/form/group-input/FormRow";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { typeCategories } from "@/types/categories";
import React, { useEffect } from "react";

interface FiltersComponentProps {
    onTypeCategoryChange: (type: typeCategories) => void;
}

const FiltersComponentCategories: React.FC<FiltersComponentProps> = ({ onTypeCategoryChange }) => {

    const [selectedTypeCategory, setSelectedTypeCategory] = React.useState<typeCategories | null>(null);

    useEffect(() => {
        onTypeCategoryChange(selectedTypeCategory);
    }, [selectedTypeCategory]);

    return (
        <div className="flex gap-4 mb-4">
            <FormRow>
                <FormGroupInput>
                    <Label htmlFor="filterStatus">Tipo Categoria</Label>
                    <Select 
                        name="filterStatus"
                        options={[
                            { value: "Mains", label: "Principal" },
                            { value: "Subcategories", label: "Subcategoría" }
                        ]}
                        value={selectedTypeCategory || ''}
                        onChange={(e) => {
                            const selectedOption = e.target.value;
                            setSelectedTypeCategory(selectedOption as typeCategories);
                        }}
                    />
                </FormGroupInput>
            </FormRow>
        </div>
    )
}

export default FiltersComponentCategories;