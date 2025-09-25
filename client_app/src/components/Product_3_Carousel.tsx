// src/components/ProductCarousel.tsx
import React, { useEffect, useMemo, useRef } from "react";
import Slider, { Settings } from "react-slick";
import ProductCard from "./ProductCard";
import { IProduct } from "../types/product";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrevArrowIcon, NextArrowIcon } from "./icons";
import { APP_ENV } from "../env";
import { useGetCategoryTreeQuery } from "../services/categoryApi";

type Props = {
  products: IProduct[] | undefined;
  maxWidth?: string | number;
  title?: string;
};

const Product_3_Carousel: React.FC<Props> = ({
  products = [],
  maxWidth = "1301px",
  title = "",
}) => {
  const { data: categories } = useGetCategoryTreeQuery();

  const defaultSlides = useMemo(() => {
    if (typeof maxWidth === "number") return maxWidth >= 1300 ? 3 : 2;
    if (typeof maxWidth === "string" && maxWidth.endsWith("px")) {
      const n = parseInt(maxWidth, 10);
      return isNaN(n) ? 3 : n >= 1300 ? 3 : 2;
    }
    return 3;
  }, [maxWidth]);

  const sliderRef = useRef<Slider | null>(null);

  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: defaultSlides,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1680, settings: { slidesToShow: 2 } },
      { breakpoint: 866, settings: { slidesToShow: 3 } }, // планшети / невеликі ноутбуки мобільні — 3 картки
      { breakpoint: 640, settings: { slidesToShow: 2 } }, // мобільні — 2 картки
      // якщо хочеш 1 картку на дуже вузьких екранах, додай breakpoint: 480 -> slidesToShow: 1
    ],
  };

  const prev = () => sliderRef.current?.slickPrev();
  const next = () => sliderRef.current?.slickNext();

  const getCategoryName = (id: number) =>
    categories?.find((cat) => cat.id === id)?.name || "Категорія не вказана";

  // Примусовий перерахунок slick при зміні розміру / орієнтації (щоб DevTools теж правильно відпрацьовував)
  useEffect(() => {
    const handleResize = () => {
      if (!sliderRef.current) return;
      try {
        sliderRef.current.slickGoTo(0);
        // типізуємо innerSlider без any
        (sliderRef.current as Slider & { innerSlider?: { onWindowResized?: () => void } })?.innerSlider?.onWindowResized?.();
      } catch {
        // silent
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);


  return (
    <div className="relative mx-auto flex flex-col md:gap-[20px] md:h-[610px] w-[100%]">
      <div className="flex flex-row justify-center items-center w-[98%] h-[50px] md:h-[50px] ">
        <h2 className="text-[20px] md:text-[32px] font-['Source Sans Pro'] text-black ml-[7px]">
          {title}
        </h2>

        <div className="ml-auto flex items-center gap-[37px] w-[87px] h-[50px]">
          <button
            type="button"
            onClick={prev}
            aria-label="Попередній слайд"
            className="w-[25px] h-[50px] grid place-items-center hover:opacity-80"
          >
            <PrevArrowIcon width={25} height={50} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Наступний слайд"
            className="w-[25px] h-[50px] grid place-items-center hover:opacity-80"
          >
            <NextArrowIcon width={25} height={50} />
          </button>
        </div>
      </div>

      <div className="relative w-[99%] md:h-[540px] ">
        <Slider ref={sliderRef} {...settings}>
          {products.map((p) => (
            <div key={p.id} className="px-2.5">
              <ProductCard
                title={p.name}
                category={p.categoryName || getCategoryName(p.categoryId)}
                price={p.finalPrice ?? p.price}
                oldPrice={p.discountPercent ? p.price : undefined}
                image={
                  p.images?.[0]?.name
                    ? APP_ENV.IMAGES_1200_URL + p.images[0].name
                    : (p.imageUrl ? APP_ENV.IMAGES_1200_URL + p.imageUrl : "/NoImage.png")
                }
                productId={p.id}
                userId={1} // підстав свого користувача зі стору, або передавай через пропси
                isFavorite={p.isFavorite}
                userRating={p.rating}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Product_3_Carousel;
