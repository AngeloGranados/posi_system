import { templateType } from "@/types/blog";

export default function TemplateBox({ template, templateSelected, setTemplateSelected }: { template: templateType, templateSelected: templateType | null, setTemplateSelected: (template: templateType) => void }) {
  return (
    <div className={`p-4 border border-gray-300 hover:border-gray-500 cursor-pointer ${templateSelected === template ? "border-blue-500" : ""}`} onClick={() => setTemplateSelected(template)}>
      <div className={`h-[200px] w-full ${template.container_style}`} key={template.type_plantilla}>
        <div className={`justify-center items-center p-4 border border-gray-300 ${template.imagen_style}`}>
          <span>IMAGEN</span>
        </div>
        <div className={`p-4 border border-gray-300 justify-center items-center ${template.parrafo_style}`}>
          <span>PARRAFO</span>
        </div>
      </div>
    </div>
  );
} 
    