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
        <div className="flex justify-between">
          <p className="form-title ">Товари які можуть вас зацікавити</p>
          <Link
            to="/"
            className="font-manrope text-base text-blue2 duration-300 hover:text-pink2"
          >
            Продовжити покупки
          </Link>
        </div>
        <div className="container mx-auto  md:mt-20 flex flex-col gap-12 max-w-[1680px] px-2 md:px-0">
          <ProductCarousel
            title={"Пропозиції брендів"}
            products={brandProducts ?? []}
            maxWidth="100%"
          />
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
