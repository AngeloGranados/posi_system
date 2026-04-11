import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import FormRow from "@/components/form/group-input/FormRow";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import React, { useEffect } from "react";

interface FiltersComponentProps {
    onStatusChange: (status: 'active' | 'inactive') => void;
}

const FiltersComponentShippingMethods: React.FC<FiltersComponentProps> = ({ onStatusChange }) => {

    const [selectedStatus, setSelectedStatus] = React.useState<'active' | 'inactive'>('active');

    useEffect(() => {
        onStatusChange(selectedStatus);
    }, [selectedStatus]);

    return (
        <div className="flex gap-4 mb-4">
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

export default FiltersComponentShippingMethods;