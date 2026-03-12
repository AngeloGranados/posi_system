"use client";
import React, { useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import AddIcon from "../../../../public/images/icons/add-icon";
import CancelIcon from "../../../../public/images/icons/cancel-icon";

const ImagesDropzone: React.FC<{imageExtrasFiles: File[] | string[]; setImageExtrasFiles: React.Dispatch<React.SetStateAction<File[] | string[]>>}> = ({imageExtrasFiles, setImageExtrasFiles}) => {

  const [previewImages, setPreviewImages] = React.useState<string[]>([]);

  const onDropHandler = (acceptedFiles: File[]) => {
    setImageExtrasFiles(acceptedFiles); 
  };

  useEffect(() => {
    if (imageExtrasFiles) {
      const newPreviewImages = imageExtrasFiles.map((file)=> {
        if (file instanceof File && file.size > 0) {
          return URL.createObjectURL(file);
        }
        return null;
      });
      setPreviewImages(newPreviewImages as string[]);
      
      return () => {
        newPreviewImages.forEach((url) => {
          if (url) {
            URL.revokeObjectURL(url);
          }
        });
      };
    }
  }, [imageExtrasFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropHandler,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });

  function handleDeteleteImageAdditional(e: React.MouseEvent<HTMLButtonElement>, index: number) {
    e.stopPropagation();
    const newFiles = [...imageExtrasFiles];
    newFiles.splice(index, 1);
    setImageExtrasFiles(newFiles as File[]);
  }

  return (
    <ComponentCard title="Insertar Imagenes Adicionales">
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
        <div
          {...getRootProps()}
          className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }
      `}
          id="demo-upload"
        >
          {/* Hidden Input */}
          <input {...getInputProps()} />

          <div className="flex flex-wrap gap-4">
            {imageExtrasFiles.map((image, index) => {
              if (image && image instanceof File && image.size > 0 && previewImages[index]) {
                return (
                  <div key={index} className="relative w-[85px] h-[100px] bg-gray-100 dark:bg-gray-800 dz-message flex flex-col justify-center items-center m-0!">
                    <button type="button" className="w-5 h-5 absolute top-2 right-1 cursor-pointer" onClick={(e) => handleDeteleteImageAdditional(e, index)}>
                      <CancelIcon fill="red" width={20} height={20}/>
                    </button>
                    <Image
                      unoptimized={process.env.NODE_ENV ? true : false}
                      className="w-full h-auto rounded-lg object-cover"
                      src={previewImages[index]}
                      alt={`Image ${index + 1}`}
                      width={85}
                      height={100}
                    />
                  </div>
                ); 
              }
              if (typeof image === "string" && image.length > 0) {
                return (
                  <div key={index} className="w-[85px] h-[100px] bg-gray-100 dark:bg-gray-800 dz-message flex flex-col justify-center items-center m-0!">
                    <Image
                      unoptimized={process.env.NODE_ENV ? true : false}
                      className="w-full h-auto rounded-lg object-cover"
                      src={(process.env.NEXT_PUBLIC_URL_IMAGES ?? "") + image}
                      alt={`Image ${index + 1}`}
                      width={85}
                      height={100}
                    />
                  </div>
                );
              }
              return (
                <div key={index} className="w-[85px] h-[100px] bg-gray-100 dark:bg-gray-800 dz-message flex flex-col justify-center items-center m-0!">
                  <AddIcon width={40} height={40}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default ImagesDropzone;
