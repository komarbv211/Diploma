import React, { useState } from "react";
import { Layout, Spin, Pagination, Empty } from "antd";
import { useAppSelector } from "../../store/store";
import UserSidebar from "./userPages/UserSidebar";
import { useGetFavoritesQuery } from "../../services/favoriteApi";
import ProductCard from "../../components/ProductCard";
import { APP_ENV } from "../../env";
import { getUser } from "../../store/slices/userSlice";

const { Content } = Layout;

const UserFavorites: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const { data: favorites, isLoading } = useGetFavoritesQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const user = useAppSelector(getUser);
  const userId = user?.id ? Number(user.id) : undefined;

  if (!auth.user) {
    return (
      <Content className="flex justify-center items-center min-h-[300px]">
        <p>Ви повинні увійти, щоб переглянути улюблені товари.</p>
      </Content>
    );
  }

  if (isLoading) {
    return (
      <Content className="flex justify-center items-center min-h-[300px]">
        <Spin size="large" />
      </Content>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const currentFavorites =
    favorites?.slice(startIndex, startIndex + pageSize) || [];

  return (
    <Layout className="bg-white w-[93%] mx-auto font-manrope min-h-[810px]">
      <h1 className="text-[28px] font-bold mt-12 mb-6 text-center">
        Мої улюблені товари
      </h1>

      <div className="flex gap-6 mt-7">
        <div className="mt-5">
          <UserSidebar />
        </div>
        <Content className="flex flex-col flex-1 items-start">
          {currentFavorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {currentFavorites.map((fav) => (
                <ProductCard
                  key={fav.productId}
                  title={fav.name}
                  category={fav.categoryName}
                  oldPrice={fav.discountPercent ? fav.price : undefined}
                  price={fav.finalPrice ?? fav.price}
                  image={
                    fav.imageName ? APP_ENV.IMAGES_1200_URL + fav.imageName : ""
                  }
                  productId={fav.productId}
                  userId={userId || 1}
                  userRating={fav.averageRating ?? 0}
                  isFavorite={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-start ml-[32%] text-center w-full mt-12">
              <Empty
                description={
                  <span className="text-[18px] text-gray-500">
                    У вас поки немає улюблених товарів.
                  </span>
                }
              />
            </div>
          )}

          {favorites && favorites.length > pageSize && (
            <div className="flex justify-center mt-8 w-full">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={favorites.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </Content>
      </div>
    </Layout>
  );
};

export default UserFavorites;
