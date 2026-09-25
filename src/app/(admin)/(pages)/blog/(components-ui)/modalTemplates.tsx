'use client';

import TipTapEditor from '@/components/form/TipTapEditor';
import TemplateBox from './TemplateBox';
import Image from 'next/image';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { templateType } from '@/types/blog';
import DropzoneComponent from '@/components/form/form-elements/DropZone';
import { DEFAULT_CONFIG } from '../../../../../../config';

interface ModalTemplatesProps {
    setFormTemplates: (template: templateType) => void;
    openModalTemplate: boolean;
    setOpenModalTemplate: (open: boolean) => void;
    templatesOptions: Array<templateType>;
}

export default function ModalTemplates({ setFormTemplates, openModalTemplate, setOpenModalTemplate, templatesOptions }: ModalTemplatesProps) {

    const [FormDataTemplate, setFormDataTemplate] = useState<Partial<templateType>>({
        imagen_content: new File([], ""),
        parrafo_content: "",
    });

    const [templateSelected, setTemplateSelected] = useState<templateType | null>(null);

    const handleImageChange = (files: File[]) => {
        if (files && files.length > 0) {
            const file = files[0];
            setFormDataTemplate({ ...FormDataTemplate, imagen_content: file });
        }
    };

    const handleCloseModal = () => {
        setOpenModalTemplate(false);
        setFormDataTemplate({ imagen_content: new File([], ""), parrafo_content: "" });
        setTemplateSelected(null);
    };

    const handleSaveTemplate = () => {

        if (!templateSelected) {
            alert("Por favor seleccione una plantilla antes de guardar.");
            return;
        }

        if ( (FormDataTemplate.imagen_content as File).size === 0 || !FormDataTemplate.parrafo_content) {
            alert("Por favor complete todos los campos antes de guardar.");
            return;
        }

        setFormTemplates({ ...templateSelected, ...FormDataTemplate as templateType });
        handleCloseModal();
    };

    return (
        <div className={`fixed w-full h-full z-50 top-0 left-0 flex items-center justify-center ${openModalTemplate ? "" : "hidden"}`}>
          <div className="fixed w-full h-full bg-black opacity-50"></div>
          <button type="button" onClick={handleCloseModal} className="absolute top-[60px] right-[140px] p-4 cursor-pointer z-60 w-10 h-10 flex items-center justify-center bg-black text-white rounded-full">X</button>
          <div className="w-[80%] h-[80%] overflow-auto py-0 px-4 pt-4 bg-white z-50">
            {
                !templateSelected ? (
                    <div className="grid grid-cols-3 gap-5 mb-5">
                    {
                        templatesOptions && templatesOptions.map((template) => (
                        <TemplateBox key={template.type_plantilla} template={template} templateSelected={templateSelected} setTemplateSelected={(template) => setTemplateSelected(template)}></TemplateBox>
                        ))
                    }
                    </div>
                ) : (
                    <div>
                        <div className={`mb-20 p-4 w-[900px] h-[900px] m-auto border border-gray-300 ${templateSelected?.container_style}`}>
                            <div className={`p-4 bg-gray-100 border border-gray-300 ${templateSelected?.imagen_style}`}> 
                                <div className='h-full overflow-auto'>                         
                                    <DropzoneComponent
                                    onDrop={handleImageChange}
                                    image={FormDataTemplate.imagen_content as File}
                                    ImageDefault={FormDataTemplate.imagen_content as File ? `${DEFAULT_CONFIG.imagesRoot}blog/${(FormDataTemplate.imagen_content as File).name}` : undefined}
                                    />
                                </div>
                                
                            </div>
                            <div className={`p-4 bg-gray-100 border border-gray-300 ${templateSelected?.parrafo_style}`}>
                                <TipTapEditor content={templateSelected?.parrafo_content || ""} onChange={(content) => setFormDataTemplate({ ...FormDataTemplate, parrafo_content: content })} />
                            </div>
                        </div>
                        <div className="flex justify-end sticky bottom-0 bg-white p-4 border-t border-gray-300">
                            <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSaveTemplate}>Guardar</button>
                            <button type="button" onClick={() => setTemplateSelected(null)} className="px-4 py-2 bg-gray-500 text-white rounded ml-2">Cancelar</button>
                        </div>
                    </div>
                )
            }
          </div>
        </div>
    );
}