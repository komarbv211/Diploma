import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilter, { ProductFilterData } from "../components/filter/ProductFilter";
import { useSearchProductsQuery } from "../services/productApi";
import { useGetCategoryTreeQuery, useGetChildrenByIdQuery } from "../services/categoryApi";
import { APP_ENV } from "../env";
import { useAppSelector } from "../store/store";
import { getUser } from "../store/slices/userSlice";
import { useParams } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { Pagination } from "antd"; 
import { useProducts } from "../hooks/useProducts";
import { useGetBrandsQuery } from "../services/brandApi";
import { useGetRandomCommentsQuery } from "../services/productCommentsApi";
import ReviewProductCard from "../components/comments/ReviewProductCard";
import Product_3_Carousel from "../components/Product_3_Carousel";
import Breadcrumbs from "../components/breadcrumbs/Breadcrumbs";

// ...
const CatalogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState<ProductFilterData>({});
  const [currentPage, setCurrentPage] = useState(1);

  const user = useAppSelector(getUser);
  const isAdmin = user?.roles?.includes("Admin") ?? false;

  const [showFilter, setShowFilter] = useState(false);
  const { data: categories } = useGetCategoryTreeQuery();
  const { data: categoriesChildren } = useGetChildrenByIdQuery(Number(id));
  const { data: brands } = useGetBrandsQuery();
  const { data: randomComment } = useGetRandomCommentsQuery(1);


  const brandIds = useMemo(() => {
    return brands?.map((b) => b.id) ?? [];
  }, [brands]);

  const category = useMemo(
    () => categories?.find((cat) => cat.id === Number(id)),
    [id, categories]
  );

  const { products: brandProducts } = useProducts({
    CategoryId: Number(id),
    BrandIds: brandIds,
  }); 
  const {
    data: searchResult,
    isLoading,
    refetch,
  } = useSearchProductsQuery(
    {
      CategoryId: Number(id),
      Page: currentPage,
      ItemPerPage: 12,
      ...filters,
    },
    { skip: !id }
  );

  // // Прокручування вгору при зміні категорії
  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, [id]);
  
  useEffect(() => {
    setCurrentPage(1);
    if (id) refetch();
  }, [id, filters, refetch]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const products = searchResult?.items ?? [];

  // Випадкова дочірня категорія
  const randomChildCategory = useMemo(() => {
    if (!categoriesChildren || categoriesChildren.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * categoriesChildren.length);
    return categoriesChildren[randomIndex];
  }, [categoriesChildren]);

  // Продукти для випадкової дочірньої категорії
  const { products: categoriesChildrenProducts } = useProducts({
    CategoryId: randomChildCategory?.id,
  });
  return (
    <div className="flex flex-col lg:flex-row md:mt-[100px] pr-4 max-w-[1680px] mx-auto gap-4 pl-4 md:pl-0">
      {/* Sidebar */}
      <div className="w-full lg:w-[23.5%]">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="w-full bg-transparent text-black border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
          >
            {showFilter ? "Сховати фільтр" : "Показати фільтр"}
          </button>
        </div>

        <div className={`${showFilter ? "block" : "hidden"} lg:block`}>
          <ProductFilter onChange={setFilters} isAdmin={isAdmin} />
        </div>
      </div>

      {/* Content */}
 

      <div className="w-full lg:w-[76.5%] flex flex-col gap-6 m-0 p-0">
        
           <Breadcrumbs categoryId={Number(id)} />

        {/* Banner */}
        <div className="w-full aspect-[284/153] bg-[url('/parfum_banner.png')] bg-lightgray bg-center bg-cover bg-no-repeat rounded-lg overflow-hidden">
          {category?.image && (
            <img
              src={APP_ENV.IMAGES_1200_URL + category.image}
              alt={category.name}
              className="w-full max-h-[700px] object-cover rounded-lg"
            />
          )}
        </div>

        {/* Carousels */}
        <div className="container mx-auto  md:mt-28 flex flex-col gap-12 max-w-[1310px] px-2 md:px-0">
          <Product_3_Carousel
            title="Пропозиції брендів"
            products={brandProducts ?? []}
            maxWidth="1310px"
          />
          {/* Карусель і банер для випадкової дочірньої категорії */}
          {randomChildCategory && categoriesChildrenProducts.length > 0 && (
            <div className="flex flex-col gap-8 ">
              <Product_3_Carousel
                title={randomChildCategory.name}
                products={categoriesChildrenProducts}
                maxWidth="1310px"
              />

              {randomChildCategory.image && (
                <div className="relative w-full max-w-[1024px] aspect-[1021/484] bg-lightgray bg-center bg-cover bg-no-repeat rounded-lg overflow-hidden mx-auto">
                  <img
                    src={APP_ENV.IMAGES_1200_URL + randomChildCategory.image}
                    alt={randomChildCategory.name}
                    className="w-full max-h-[700px] object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

        </div>
        {/* Carousels */}
        <div className="container mx-auto  md:mt-28 flex flex-col gap-12 max-w-[1310px] px-2 md:px-0">
          <Product_3_Carousel
            title="Спеціально для тебе"
            products={searchResult?.items ?? []}
            maxWidth="1310px"
          />
        </div>
        {/* Один випадковий коментар */}
        {randomComment && randomComment.length > 0 && (
          <section className="flex justify-center md:mt-12">
            <div className="relative w-full max-w-[850px] aspect-[840/400] rounded-lg overflow-hidden mx-auto px-2 md:px-0">
              <ReviewProductCard
                key={randomComment[0].id}
                productName={randomComment[0].product?.name || "Товар без назви"}
                productImage={
                  randomComment[0].product?.images?.[0]
                    ? APP_ENV.IMAGES_1200_URL + randomComment[0].product.images[0].name
                    : "/NoImage.png"
                }
                reviewTitle="Відгук на товар"
                userName={randomComment[0].user?.firstName || "Анонім"}
                reviewText={randomComment[0].text}
                onGoToProduct={() =>
                  randomComment[0].productId
                    ? (window.location.href = `/product/details/${randomComment[0].productId}`)
                    : undefined
                }
              />
            </div>
          </section>
        )}
        {/* Products */}
        <div className="flex flex-wrap justify-center gap-4">
          {isLoading && <p>Завантаження...</p>}
          {!isLoading && products.length === 0 && (
            <p>Немає товарів у цій категорії.</p>
          )}
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              category={product.category?.name || ""}
              price={product.finalPrice ?? product.price}
              oldPrice={product.discountPercent ? product.price : undefined}
              userRating={product.rating}
              productId={product.id}
              userId={Number(user?.id)}
              image={
                product.imageUrl
                  ? APP_ENV.IMAGES_1200_URL + product.imageUrl
                  : ""
              }
              onRated={() => refetch()}
            />
          ))}

          {/* Pagination */}
          {searchResult?.pagination && (
            <div className="flex justify-center w-full mt-8">
              <Pagination
                current={currentPage}
                total={searchResult.pagination.totalCount}
                pageSize={12}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default CatalogPage;