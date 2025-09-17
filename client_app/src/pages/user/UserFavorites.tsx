import React, { useState } from "react";
import { Layout, Spin, Pagination } from "antd";
import { useAppSelector } from "../../store/store";
import UserSidebar from "./userPages/UserSidebar";
import { useGetFavoritesQuery } from "../../services/favoriteApi";
import ProductCard from "../../components/ProductCard";
import { IProduct } from "../../types/product";
import { APP_ENV } from "../../env";

const { Content } = Layout;

const UserFavorites: React.FC = () => {
    const auth = useAppSelector((state) => state.auth);
    const { data: favorites, isLoading } = useGetFavoritesQuery();

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9; // щоб заповнювався ряд по 3 картки
    const startIndex = (currentPage - 1) * pageSize;
    const currentFavorites = favorites?.slice(startIndex, startIndex + pageSize);

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

    const productsForDisplay: IProduct[] = (currentFavorites || []).map((item, index) => ({
        id: item.productId,
        name: item.name,
        categoryName: item.categoryName || "",
        price: item.price,
        finalPrice: item.price,
        images: item.imageName
            ? [
                {
                    id: index, // тимчасовий унікальний id
                    name: item.imageName,
                    priority: 0,
                    productId: item.productId,
                },
            ]
            : [],
        isFavorite: true,
        averageRating: 0,
        categoryId: 0,
        discountPercent: 0,
        imageUrl: item.imageName || "",
        quantity: 1,
        rating: 0,
        ratingsCount: 0,
        commentsCount: 0,
    }));



    return (
        <Layout className="bg-white w-[93%] mx-auto font-manrope min-h-[750px]">
            <h1 className="text-[28px] font-bold mt-12 mb-6 text-center">
                Мої улюблені товари
            </h1>

            <div className="flex gap-6 mt-12">
                <UserSidebar />

                <Content className="flex flex-col flex-1 items-start">
                    {productsForDisplay.length > 0 ? (
                        // Сітка: 1 картка на мобільних, 2 на планшеті, 3 на десктопі
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                            {productsForDisplay.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    title={p.name}
                                    category={p.categoryName}
                                    price={p.finalPrice ?? p.price}
                                    oldPrice={p.discountPercent ? p.price : undefined}
                                    image={
                                        p.images?.[0]?.name
                                            ? APP_ENV.IMAGES_1200_URL + p.images[0].name
                                            : p.imageUrl
                                                ? APP_ENV.IMAGES_1200_URL + p.imageUrl
                                                : ""
                                    }
                                    productId={p.id}
                                    userId={1} // заміни на свій userId зі стору
                                    userRating={p.averageRating || 0}
                                    isFavorite={p.isFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center w-full mt-12">
                            У вас поки немає улюблених товарів.
                        </p>
                    )}

                    {/* Пагінація */}
                    {favorites && favorites.length > pageSize && (
                        <div className="flex justify-center mt-8 w-full">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={favorites.length}
                                onChange={(page) => setCurrentPage(page)}
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
