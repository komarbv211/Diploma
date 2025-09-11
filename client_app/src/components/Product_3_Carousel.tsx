// src/components/ProductCarousel.tsx
import React, { useMemo, useRef } from "react";
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

  // базова логіка: якщо відома числова ширина або 'px' — вирішуємо 3 чи 4 картки
  const defaultSlides = useMemo(() => {
    if (typeof maxWidth === "number") return maxWidth >= 1200 ? 3: 2;
    if (typeof maxWidth === "string" && maxWidth.endsWith("px")) {
      const n = parseInt(maxWidth, 10);
      return isNaN(n) ? 3 : n >= 1200 ? 3 : 2;
    }
    return 3; // для "100%" і подібного — нехай буде 4 + працюють брейкпоінти
  }, [maxWidth]);

  const sliderRef = useRef<Slider | null>(null);

  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: defaultSlides,
    slidesToScroll: 1,
    arrows: false, // ВИМКНУЛИ бічні стрілки
    responsive: [
      { breakpoint: 1250, settings: { slidesToShow: 2 } },
      { breakpoint: 840, settings: { slidesToShow: 1 } },
    ],
  };

  const prev = () => sliderRef.current?.slickPrev();
  const next = () => sliderRef.current?.slickNext();

  const getCategoryName = (id: number) => {
    return (
      categories?.find((cat) => cat.id === id)?.name || "Категорія не вказана"
    );
  };

  return (
    <div className="relative mx-auto flex flex-col gap-[20px] h-[610px] w-[100%]">
      {/* Frame 136: заголовок по центру, кнопки справа */}
      <div className="flex flex-row justify-center items-center w-[98%] h-[50px] ">
        <h2 className="text-[32px] font-['Source Sans Pro'] text-black ml-1">
          {title}
        </h2>

        <div className="ml-auto flex items-center gap-[37px] w-[87px] h-[50px]">
          <button
            type="button"
            onClick={prev}
            aria-label="Попередній слайд"
            className="w-[25px] h-[50px] grid place-items-center hover:opacity-80"
          >
            {/* ліва сіра */}
            <PrevArrowIcon width={25} height={50} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Наступний слайд"
            className="w-[25px] h-[50px] grid place-items-center hover:opacity-80"
          >
            {/* права чорна */}
            <NextArrowIcon width={25} height={50} />
          </button>
        </div>
      </div>

      {/* Frame 198: слайдер 540px заввишки */}
      <div className="relative w-[99%] h-[540px] ">
        <Slider ref={sliderRef} {...settings}>
          {products.map((p) => (
            <div key={p.id} className="px-2">
              <ProductCard
                title={p.name}
                category={p.categoryName || getCategoryName(p.categoryId)}
                price={p.finalPrice ?? p.price}
                oldPrice={p.discountPercent ? p.price : undefined}
                image={
                  p.images?.[0]?.name
                    ? APP_ENV.IMAGES_1200_URL + p.images[0].name
                    : APP_ENV.IMAGES_1200_URL + p.imageUrl || " "
                }
                productId={p.id}
                userId={1} // підстав свого користувача зі стору
                userRating={p.averageRating || 0}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Product_3_Carousel;
