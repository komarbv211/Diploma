import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useGetOrderByIdQuery } from "../../../services/orderApi";
import { Link } from "react-router-dom";
import { useGetBrandsQuery } from "../../../services/brandApi";
import { useProducts } from "../../../hooks/useProducts";
import ProductCarousel from "../../../components/ProductCarousel";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const { data: brands } = useGetBrandsQuery();

  const brandIds = useMemo(() => {
    return brands?.map((b) => b.id) ?? [];
  }, [brands]);

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const { products: newProducts } = useProducts({
    StartDate: sevenDaysAgo.toISOString().split("T")[0],
    EndDate: today.toISOString().split("T")[0],
  });
  const { products: brandProducts } = useProducts({
    BrandIds: brandIds,
  });
  const { isLoading } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  if (isLoading) return <p>Завантаження...</p>;

  return (
    <div className="w-[93%] mx-auto font-manrope min-h-[750px]">
      <hr className="my-10 border-1 border-gray rounded" />

      <div className="max-w-6xl mx-auto mt-16 bg-beige2 rounded-lg text-center py-[40px] px-[60px]">
        <p className="text-[32px] font-bold bg-gradient-to-r from-blue2 to-blueLight bg-clip-text text-transparent mb-3">
          Оформлення пройшло успішно!
        </p>
        <p className="font-manrope text-sm md:text-base font-medium text-gray-700 mb-6">
          Ваше замовлення готується до відправки.
        </p>
        <div className="flex justify-center">
          <img
            src="/shopping-cart.png"
            alt="shopping cart"
            width={200}
            className="-rotate-3"
          />
        </div>
      </div>
      <div className="mt-16">
        <div className="container mx-auto md:mt-20 flex flex-col gap-5 max-w-[1680px] px-2 md:px-0 mb-[5%]">
          <div className="flex items-center justify-between mb-4 ml-2">
            <div className="flex items-center">
              <p className="font-manrope font-semibold text-[26px]">
                Товари, які можуть вас зацікавити
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#666"
                className="ml-4"
                viewBox="0 0 32 32"
              >
                <path d="M8.037 11.166L14.5 22.36c.825 1.43 2.175 1.43 3 0l6.463-11.195c.826-1.43.15-2.598-1.5-2.598H9.537c-1.65 0-2.326 1.17-1.5 2.6z" />
              </svg>
            </div>
            <Link
              to="/"
              className="font-manrope text-lg text-blue2 duration-300 hover:text-pink2 font-semibold"
            >
              Продовжити покупки
            </Link>
          </div>

          <ProductCarousel
            title={"Пропозиції брендів"}
            products={brandProducts ?? []}
            maxWidth="100%"
          />
          <br />
          <ProductCarousel
            title={"Новинки"}
            products={newProducts ?? []}
            maxWidth="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
