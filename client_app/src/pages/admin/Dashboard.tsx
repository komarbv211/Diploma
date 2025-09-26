import { Card, Statistic, DatePicker, Spin } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs"; // Використовуємо Dayjs
import {
  useGetRevenueQuery,
  useGetTopProductsQuery,
  useGetOrdersSummaryQuery,
  useGetSalesByCategoryQuery,
  useGetNewCustomersQuery,
  useGetRepeatPurchasesQuery,
  useGetUserAnalyticsQuery,
} from "../../services/admin/analyticsAdminApi";
import ScrollToTopButton from "../../components/ScrollToTopButton";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const { RangePicker } = DatePicker;

const Dashboard = () => {
  // Стейт для дати (Dayjs)
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, "month"),
    dayjs(),
  ]);

  const startUtc = dates[0].startOf("day").toISOString();
  const endUtc = dates[1].endOf("day").toISOString();

  // Виклики API
  const { data: revenue = [], isLoading: loadingRevenue } = useGetRevenueQuery({
    startUtc,
    endUtc,
  });
  const { data: ordersSummary, isLoading: loadingOrders } =
    useGetOrdersSummaryQuery({ startUtc, endUtc });
  const { data: userAnalytics, isLoading: loadingUsers } =
    useGetUserAnalyticsQuery({ startUtc, endUtc });
  const { data: newCustomers, isLoading: loadingNewCustomers } =
    useGetNewCustomersQuery({ startUtc, endUtc });
  const { data: repeatPurchases, isLoading: loadingRepeat } =
    useGetRepeatPurchasesQuery({ startUtc, endUtc });
  const { data: topProducts = [], isLoading: loadingTop } =
    useGetTopProductsQuery({ top: 5, startUtc, endUtc });
  const { data: salesByCategory = [], isLoading: loadingCategories } =
    useGetSalesByCategoryQuery({ startUtc, endUtc });

  // Дані для графіка
  const chartData = useMemo(
    () => ({
      labels: revenue.map((d) => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          label: "Продажі",
          data: revenue.map((d) => d.revenue),
          backgroundColor: "#E56B93",
          borderRadius: 8,
        },
      ],
    }),
    [revenue]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
    },
  };

  return (
    <div className="p-4">
      {/* Заголовок */}
      {/* <div className="text-center mb-6">
    <h1 className="text-3xl font-bold">Адмін Панель</h1>
    <p className="text-lg mt-2">Ласкаво просимо! Тут ви можете переглядати аналітику сайту.</p>
  </div> */}

      {/* Фільтр по датах */}
      <div className="flex justify-center mb-6">
        <RangePicker
          value={dates}
          onChange={(val) => val && setDates([val[0]!, val[1]!])}
          format="YYYY-MM-DD"
          allowClear={false}
          className="px-4 py-2 rounded-lg font-manrope"
        />
      </div>

      {/* Верхній рядок: 4 показники */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="shadow-md text-center">
          <Statistic
            title="Дохід"
            value={
              loadingRevenue
                ? undefined
                : revenue.reduce((acc, r) => acc + r.revenue, 0)
            }
            precision={2}
            valueStyle={{ color: "#8A0149" }} className="font-manrope"
            prefix={loadingRevenue ? <Spin /> : "$"}
          />
        </Card>
        <Card className="shadow-md text-center">
          <Statistic
            title="Замовлення"
            value={loadingOrders ? undefined : ordersSummary?.ordersCount}
            valueStyle={{ color: "#403b8c" }} className="font-manrope"
            prefix={loadingOrders ? <Spin /> : undefined}
          />
        </Card>
        <Card className="shadow-md text-center">
          <Statistic
            title="Користувачі"
            value={loadingUsers ? undefined : userAnalytics?.totalUsers}
            valueStyle={{ color: "#bf6996" }} className="font-manrope"
            prefix={loadingUsers ? <Spin /> : undefined}
          />
        </Card>
        <Card className="shadow-md text-center">
          <Statistic
            title="Нові клієнти"
            value={loadingNewCustomers ? undefined : newCustomers?.newCustomers}
            valueStyle={{ color: "#E56B93" }} className="font-manrope"
            prefix={loadingNewCustomers ? <Spin /> : undefined}
          />
        </Card>
        <Card className="shadow-md text-center flex-1">
          <Statistic
            title="Повторні покупки"
            value={
              loadingRepeat
                ? undefined
                : repeatPurchases?.customersWithRepeatPurchase
            }
            suffix={
              repeatPurchases
                ? `/ ${repeatPurchases.customersTotal}`
                : undefined
            }
            valueStyle={{ color: "#1A3D83" }}
            prefix={loadingRepeat ? <Spin /> : undefined}
          />
        </Card>
      </div>

      {/* Нижній рядок: графік + правий стовпчик */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Графік продажів (зліва, займає 3 колонки) */}
        <Card className="shadow-md p-4 lg:col-span-3 h-full">
          <h2 className="text-xl font-semibold text-center mb-10">
            Аналітика продажів
          </h2>
          <div className="w-full h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Card>

        {/* Правий стовпчик */}
        <div className="flex flex-col lg:col-span-2 gap-4 h-full">
          <Card className="shadow-md flex-1">
            <h3 className="text-lg font-semibold mb-5">Топ продуктів</h3>
            {loadingTop ? (
              <Spin className="mx-auto" />
            ) : (
              <ul className="space-y-2 font-manrope">
                {topProducts.map((p) => (
                  <li
                    key={p.productId}
                    className="flex justify-between px-3 py-2 border border-[#d9d9d9] rounded-lg hover:bg-gray-50"
                  >
                    <span>{p.productName}</span>
                    <span className="font-semibold">
                      {p.revenue.toLocaleString()} $
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="shadow-md flex-1">
            <h3 className="text-lg font-semibold mb-5">
              Продажі по категоріях
            </h3>
            {loadingCategories ? (
              <Spin className="mx-auto" />
            ) : (
              <ul className="space-y-2 font-manrope">
                {salesByCategory.map((c) => (
                  <li
                    key={c.categoryId}
                    className="flex justify-between px-3 py-2 border border-[#d9d9d9] rounded-lg hover:bg-gray-50"
                  >
                    <span>{c.categoryName}</span>
                    <span className="font-semibold">
                      {c.revenue.toLocaleString()} $
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default Dashboard;
