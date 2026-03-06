'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import { Discounts } from "@/types/discounts";


interface ModalDiscountsProps {
    isOpen: boolean;
    closeModal: () => void;
    selected: Discounts | null;
    setSelected: (Discounts: Discounts | null) => void;
    handleCreateDiscounts: (e: React.FormEvent<HTMLFormElement>, Discounts: Discounts) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalDiscounts({ isOpen, closeModal, selected, setSelected, handleCreateDiscounts, alertProps } : ModalDiscountsProps) {

    const emptyDiscounts: Discounts = {
        product_id: 0,
        discount_type: "percentage",
        discount_value: 0,
        valid_from: new Date(),
        valid_until: new Date()
    };

    // Si selected existe, usarlo; si no, usar emptyDiscounts
    const [FormDataDiscounts, setFormDataDiscounts] = useState<Discounts>(selected || emptyDiscounts);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if(isOpen && !selected){
        handleClearForm();
      }else{
        if(selected) {
          selected.valid_from = selected.valid_from ? new Date(selected.valid_from) : new Date();
          selected.valid_until = selected.valid_until ? new Date(selected.valid_until) : new Date();
        }
        setFormDataDiscounts(selected || emptyDiscounts);
      }
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataDiscounts(emptyDiscounts);
      setSelected(null);
      alertProps.closeAlert();
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataDiscounts((prevData) => {      

            if(name === "min_purchase" || name === "max_discount" || name === "usage_limit" || name === "discount_value" || name === "product_id") {
                return {
                    ...prevData,
                    [name]: Number(value) 
                };
            }

            return {
                ...prevData,
                [name]: value
            };
        });
    }

    const selectOptionsTypeDiscount = [
        { value: "percentage", label: "Porcentaje" },
        { value: "fixed", label: "Monto Fijo" },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            className="max-w-[700px] p-6 lg:p-10"
          >
            <form onSubmit={(e) => handleCreateDiscounts(e, FormDataDiscounts)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Descuento` : `Agregar Descuento`}
                </h5>
              </div>
              <div className="mt-8">
                { alertProps.showAlert && (
                  <Alert
                    title={alertProps.alertTitle}
                    variant={alertProps.alertVariant}
                    message={alertProps.alertMessage}
                  />
                )}
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="product_id">Producto(ID):</Label>
                      <InputField
                        type="number"
                        id="input-product_id"
                        name="product_id"
                        value={FormDataDiscounts && FormDataDiscounts.product_id ? FormDataDiscounts.product_id : 0}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="discount_type">Tipo de Descuento:</Label>
                      <Select
                        name="discount_type"
                        options={selectOptionsTypeDiscount}
                        value={FormDataDiscounts && FormDataDiscounts.discount_type ? FormDataDiscounts.discount_type : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="description">Descuento:</Label>
                      <InputField 
                        type="number"
                        name="discount_value"
                        value={FormDataDiscounts && FormDataDiscounts.discount_value ? FormDataDiscounts.discount_value : 0}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="valid_from">Valido desde:</Label>
                      <DatePicker 
                        id="valid_from"
                        placeholder="Seleccionar fecha"
                        defaultDate={FormDataDiscounts.valid_from || new Date()}
                        onChange={(dates, currentDateString) => {
                          setFormDataDiscounts((prev) => ({
                            ...prev,
                            valid_from: currentDateString ? new Date(currentDateString) : prev.valid_from,
                          }));
                        }}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="valid_until">Valido Hasta:</Label>
                      <DatePicker 
                        id="valid_until"
                        placeholder="Seleccionar fecha"
                        defaultDate={FormDataDiscounts.valid_until}
                        onChange={(dates, currentDateString) => {
                          setFormDataDiscounts((prev) => ({
                            ...prev,
                            valid_until: currentDateString ? new Date(currentDateString) : prev.valid_until,
                          }));
                        }}
                      />
                  </FormGroupInput>
                </FormRow>
              </div>
              <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                >
                  {selected ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
        </Modal>

    )
}