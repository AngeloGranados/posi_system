'use client';

import { Modal } from "@/components/ui/modal";
import InputField from "@/components/form/input/InputField";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import FormRow from "@/components/form/group-input/FormRow";
import FormGroupInput from "@/components/form/group-input/FormGroupInput";
import TextArea from "@/components/form/input/TextArea";
import { PromoCodes } from "@/types/promoCodes";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";


interface ModalPromoCodesProps {
    isOpen: boolean;
    loading: boolean;
    closeModal: () => void;
    selected: PromoCodes | null;
    setSelected: (PromoCodes: PromoCodes | null) => void;
    handleCreatePromoCodes: (e: React.FormEvent<HTMLFormElement>, PromoCodes: PromoCodes) => Promise<void>;
    alertProps: {
      showAlert: boolean;
      alertMessage: string;
      alertVariant: "success" | "warning" | "error";
      alertTitle: string;
      closeAlert: () => void;
    }
}

export default function ModalPromoCodes({ loading, isOpen, closeModal, selected, setSelected, handleCreatePromoCodes, alertProps } : ModalPromoCodesProps) {

    const emptyPromoCodes: PromoCodes = {
        code: "",
        description: "",
        discount_type: "percentage",
        discount_value: 0,
        min_purchase: 0,
        max_discount: 0,
        usage_limit: 0,
        valid_from: new Date(),
        valid_until: new Date()
    };

    // Si selected existe, usarlo; si no, usar emptyPromoCodes
    const [FormDataPromoCodes, setFormDataPromoCodes] = useState<PromoCodes>(selected || emptyPromoCodes);

    // Actualiza el estado cuando cambia selected
    useEffect(() => {
      if(isOpen && !selected){
        handleClearForm();
      }else{
        if(selected) {
          selected.valid_from = selected.valid_from ? new Date(selected.valid_from) : new Date();
          selected.valid_until = selected.valid_until ? new Date(selected.valid_until) : new Date();
        }
        setFormDataPromoCodes(selected || emptyPromoCodes);
      }
    },[selected, isOpen]);

    const handleCloseModal = () => {
        handleClearForm();
        closeModal();
    }

    const handleClearForm = () => {
      setFormDataPromoCodes(emptyPromoCodes);
      setSelected(null);
      alertProps.closeAlert();
    }

    // Handler universal, siempre actualiza el estado
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        e.preventDefault();
        setFormDataPromoCodes((prevData) => {      

            if(name === "min_purchase" || name === "max_discount" || name === "usage_limit" || name === "discount_value"){
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
            <form onSubmit={(e) => handleCreatePromoCodes(e, FormDataPromoCodes)} className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {selected ? `Editar Categoria` : `Agregar Categoria`}
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
                      <Label htmlFor="code">Codigo:</Label>
                      <InputField
                        id="input-code"
                        name="code"
                        value={FormDataPromoCodes && FormDataPromoCodes.code ? FormDataPromoCodes.code : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="description">Descripción:</Label>
                      <TextArea
                        name="description"
                        value={FormDataPromoCodes && FormDataPromoCodes.description ? FormDataPromoCodes.description : ""}
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
                        value={FormDataPromoCodes && FormDataPromoCodes.discount_type ? FormDataPromoCodes.discount_type : ""}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="description">Descuento:</Label>
                      <InputField 
                        type="number"
                        name="discount_value"
                        value={FormDataPromoCodes && FormDataPromoCodes.discount_value ? FormDataPromoCodes.discount_value : 0}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                </FormRow>
                <FormRow>
                  <FormGroupInput>
                      <Label htmlFor="discount_type">Minimo de Compra:</Label>
                      <InputField 
                        type="number"
                        name="min_purchase"
                        value={FormDataPromoCodes && FormDataPromoCodes.min_purchase ? FormDataPromoCodes.min_purchase : 0}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="max_discount">Maximo de Descuento:</Label>
                      <InputField 
                        type="number"
                        name="max_discount"
                        value={FormDataPromoCodes && FormDataPromoCodes.max_discount ? FormDataPromoCodes.max_discount : 0}
                        onChange={handleDataChange}
                      />
                  </FormGroupInput>
                  <FormGroupInput>
                      <Label htmlFor="usage_limit">Limite de Uso:</Label>
                      <InputField 
                        type="number"
                        name="usage_limit"
                        value={FormDataPromoCodes && FormDataPromoCodes.usage_limit ? FormDataPromoCodes.usage_limit : 0}
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
                        defaultDate={FormDataPromoCodes.valid_from || new Date()}
                        onChange={(dates, currentDateString) => {
                          setFormDataPromoCodes((prev) => ({
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
                        defaultDate={FormDataPromoCodes.valid_until}
                        onChange={(dates, currentDateString) => {
                          setFormDataPromoCodes((prev) => ({
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
                  disabled={loading}
                  className={`btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto ${loading ? "opacity-50 cursor-not-allowed bg-brand-600" : ""}`}
                >
                  {loading ? "..cargando" : selected ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
        </Modal>

    )
}