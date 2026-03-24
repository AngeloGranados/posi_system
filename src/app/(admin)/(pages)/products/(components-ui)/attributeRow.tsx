import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import FormRow from "@/components/form/group-input/FormRow";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import InputField from "@/components/form/input/InputField";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import DeleteIcon from "../../../../../../public/images/icons/delete-icon";
import { getAttributesProductsValuesFiltered } from "@/services/attributesServices";
import debounce from "debounce";

// Componente memoizado para cada fila de atributo con filtro local
const AttributeRow = React.memo(function AttributeRow({
  attr,
  index,
  handleAttributesChange,

  categoryAttributes,
  handleDeleteAttribute
}: {
  attr: { key: string; value: string };
  index: number;
  handleAttributesChange: (index: number, field: "key" | "value", value: string) => void;
  categoryAttributes: { value: string; label: string }[];
  handleDeleteAttribute: (index: number) => void;
}) {
  const [localFilter, setLocalFilter] = useState("");
  const [filterLike, setFilterLike] = useState("");
  const [attributesValuesList, setAttributesValuesList] = useState<{ key: string; value: string }[]>([]);

    useEffect(() => {
        fetchAttributesValues()
    }, [filterLike]); 
    async function fetchAttributesValues() {
        try {
            const response = await getAttributesProductsValuesFiltered({ filterLike: filterLike, limit: 5 })
            setAttributesValuesList(response.data.map(attr => ({ key: attr.category_attribute_id as string, value: attr.attribute_value as string })));
        }catch (error) {
            console.error("Error fetching attributes values:", error);
        }
    }

    const debounceOnchangeAttributesFilter = useCallback(debounce((value: string) => {
        setFilterLike(value);
    }, 500), []);

    const handleOnchangeFilterLike = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFilter(e.target.value);
        debounceOnchangeAttributesFilter(e.target.value);
    }

  return (
    <FormRow key={index}>
      <FormGroupInput>
        <Label htmlFor="key">Atributo:</Label>
        <Select
          onChange={e => handleAttributesChange(index, "key", e.target.value)}
          name="key"
          value={attr.key ? attr.key : ""}
          options={categoryAttributes}
        />
      </FormGroupInput>
      <FormGroupInput>
        <Label htmlFor="value">Valor:</Label>
        <div className="relative">
            <InputField
            id="input-value"
            name="value"
            value={attr.value}
            onChange={e => {
                handleAttributesChange(index, "value", e.target.value);
                handleOnchangeFilterLike(e);
            }}
            />
            <div className={`absolute bg-white shadow-sm shadow-black py-1 px-2 z-10 left-0 right-0 top-[40px] mt-1 ${localFilter && attributesValuesList.length > 0 ? "block" : "hidden"}`}>
                <ul className="text-sm text-gray-600">
                    {attributesValuesList && attributesValuesList
                    .map((attrValue, idx) => (
                        <li key={idx}>
                            <button
                                onClick={() => {
                                    handleAttributesChange(index, "value", attrValue.value);
                                    setLocalFilter("");
                                    setAttributesValuesList([]);
                                }} 
                                type="button" 
                                className="hover:bg-gray-100 cursor-pointer w-full py-1 px-2">
                                {attrValue.value}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </FormGroupInput>
      <button
        type="button"
        onClick={() => handleDeleteAttribute(index)}
      >
        <DeleteIcon className="mb-4" fill="red" width={20} height={20} />
      </button>
    </FormRow>
  );
}); 

export default AttributeRow;