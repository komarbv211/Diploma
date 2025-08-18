import { useEffect, useRef, useState } from "react";
import { Image } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { APP_ENV } from "../../../env";
import { IProductImageDto } from "../../../types/product";

interface ImageViewerProps {
  className?: string;
  advertImages: IProductImageDto[];
}

const ImagesViewer: React.FC<ImageViewerProps> = ({
  className,
  advertImages,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (advertImages.length > 0) {
      const sortedImages = advertImages
        .slice()
        .sort((a, b) => a.priority - b.priority)
        .map((x) => x.name);
      setImages(sortedImages);
      setCurrentIndex(0);
    }
  }, [advertImages]);

  if (images.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    let newIndex = currentIndex;
    if (direction === "right") {
      newIndex = (currentIndex + 1) % images.length; // перехід по кругу
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    setCurrentIndex(newIndex);

    // Прокрутка контейнера
    if (scrollRef.current) {
      const scrollAmount = 110 + 16; // ширина + gap
      scrollRef.current.scrollTo({
        left: newIndex * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`${className} flex flex-col gap-4 w-full`}>
      {/* Основне велике зображення */}
      <div className="ml-[40px] max-w-[500px] max-h-[539px] rounded-lg overflow-hidden bg-gray-200">
        <Image.PreviewGroup
          items={images.map((img) => APP_ENV.IMAGES_1200_URL + img)}
        >
          <Image
            loading="lazy"
            src={APP_ENV.IMAGES_1200_URL + images[currentIndex]}
            className="w-full h-full object-cover"
          />
        </Image.PreviewGroup>
      </div>

      {/* Нижній ряд */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => scroll("left")}
          className="w-10 h-10 flex justify-center items-center bg-gray-300 text-gray-700 rounded-lg  hover:text-pink transition"
        >
          <LeftOutlined />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-hidden w-[500px]" // важливо hidden
        >
          {images.map((image, index) => (
            <img
              key={image}
              src={APP_ENV.IMAGES_200_URL + image}
              className={`w-[110px] h-[110px] object-cover rounded-lg cursor-pointer flex-shrink-0 border-2 transition ${
                index === currentIndex
                  ? "border-pink-500"
                  : "border-transparent"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="w-10 h-10 flex justify-center items-center bg-gray-300 text-gray-700 rounded-lg   hover:text-pink transition"
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
};

export default ImagesViewer;
