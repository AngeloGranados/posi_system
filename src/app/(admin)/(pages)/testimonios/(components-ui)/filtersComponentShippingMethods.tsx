import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import FormRow from "@/components/form/group-input/FormRow";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { statusTestimonios } from "@/types/testimonios";
import React, { useEffect } from "react";

interface FiltersComponentProps {
    onStatusChange: (status: statusTestimonios) => void;
}

const FiltersComponentTestimonio: React.FC<FiltersComponentProps> = ({ onStatusChange }) => {

    const [selectedStatus, setSelectedStatus] = React.useState<statusTestimonios>('pending');

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
                            { value: "approved", label: "Aprobado" },
                            { value: "rejected", label: "Rechazado" },
                            { value: "pending", label: "Pendiente" }
                        ]}
                        value={selectedStatus || ''}
                        onChange={(e) => {
                            const selectedOption = e.target.value;
                            setSelectedStatus(selectedOption as statusTestimonios);
                        }}
                    />
                </FormGroupInput>
            </FormRow>
        </div>
    )
}

export default FiltersComponentTestimonio;