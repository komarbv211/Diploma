import React, { useRef, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { RedoOutlined, UndoOutlined } from "@ant-design/icons";

interface ImageCropperProps {
  image: string;
  aspectRatio?: number;
  onCrop: (croppedImage: string) => void;
  onCancel?: () => void;
  buttonText?: string;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  aspectRatio = undefined,
  onCrop,
  onCancel,
  buttonText = "Обрізати фото",
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);

  useEffect(() => {
    if (imageRef.current) {
      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio,
        viewMode: 1,
        zoomable: true,
        scalable: false,
        movable: false,
      });
    }

    return () => {
      cropperRef.current?.destroy();
    };
  }, [image, aspectRatio]);

  const cropImage = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCroppedCanvas();
      if (canvas) {
        const cropped = canvas.toDataURL("image/png");
        onCrop(cropped);
      }
    }
  };

  const rotateImage = (degrees: number) => {
    if (cropperRef.current) {
      cropperRef.current.rotate(degrees); // Метод для обертання зображення
    }
  };

  return (
    <div>
      <div className="border rounded-md p-2">
        <img ref={imageRef} src={image} alt="Crop" className="max-w-full" />
      </div>
      <div className="mt-4">
        <button
          onClick={cropImage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {buttonText}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="ml-2 px-4 py-2 bg-gray-300 text-white rounded-md"
          >
            Скасувати
          </button>
        )}
        {/* Кнопки для обертання зображення */}
        <div className="mt-2">
          <RedoOutlined
            onClick={() => rotateImage(90)}
            className="mr-2 px-4 py-2 bg-gray-400 text-pink rounded-md hover:text-pink2"
          />
          <UndoOutlined
            onClick={() => rotateImage(-90)}
            className="px-4 py-2 bg-gray-400 text-pink rounded-md hover:text-pink2"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
