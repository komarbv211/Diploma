// src/components/modals/CropperModal.tsx
import React from "react";
import { Modal } from "antd";
import ImageCropper from "./ImageCropper";

interface CropperModalProps {
  image: string | null;
  open: boolean;
  aspectRatio?: number;
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
  width?: number;
}

const CropperModal: React.FC<CropperModalProps> = ({
  image,
  open,
  aspectRatio = 1,
  onCrop,
  onCancel,
  width = 700,
}) => {
  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onCancel}
      width={width}
      closable={true}
      maskClosable={false}
      bodyStyle={{
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
      }}
      style={{ borderRadius: "12px" }}
    >
      {image && (
        <ImageCropper
          image={image}
          aspectRatio={aspectRatio}
          onCrop={onCrop}
          onCancel={onCancel}
        />
      )}
    </Modal>
  );
};

export default CropperModal;
