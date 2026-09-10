import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import FormRow from "@/components/form/group-input/FormRow";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { statusOrders, typeOrders } from "@/types/orders";
import React from "react";

interface FiltersComponentProps {
    onTypeOrdersChange: (type: statusOrders) => void;
}

const FiltersComponentOrders: React.FC<FiltersComponentProps> = ({ onTypeOrdersChange }) => {

    const [selectedTypeOrders, setSelectedTypeOrders] = React.useState<statusOrders>("pending");

    return (
        <div className="flex gap-4 mb-4">
            <FormRow>
                <FormGroupInput>
                    <Label htmlFor="filterStatus">Estados</Label>
                    <Select 
                        name="filterStatus"
                        options={[
                            { value: "pending", label: "Pendiente" },
                            { value: "processing", label: "En proceso" },
                            { value: "shipped", label: "Enviado" },
                            { value: "delivered", label: "Entregado" },
                            { value: "cancelled", label: "Cancelado" }
                        ]}
                        value={selectedTypeOrders || ''}
                        onChange={(e) => {
                            const selectedOption = e.target.value;
                            const selectedStatus = selectedOption as statusOrders;
                            setSelectedTypeOrders(selectedStatus);
                            onTypeOrdersChange(selectedStatus);
                        }}
                    />
                </FormGroupInput>
            </FormRow>
        </div>
    )
}

export default FiltersComponentOrders;