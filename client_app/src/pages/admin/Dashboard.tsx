import { Card } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const salesData = [
  { month: "Січень", sales: 4000 },
  { month: "Лютий", sales: 3200 },
  { month: "Березень", sales: 4500 },
  { month: "Квітень", sales: 5100 },
  { month: "Травень", sales: 6100 },
  { month: "Червень", sales: 7000 },
  { month: "Липень", sales: 6700 },
  { month: "Серпень", sales: 7500 },
  { month: "Вересень", sales: 6800 },
  { month: "Жовтень", sales: 7200 },
  { month: "Листопад", sales: 6900 },
  { month: "Грудень", sales: 8000 },
];

const data = {
  labels: salesData.map((d) => d.month),
  datasets: [
    {
      label: "Продажі",
      data: salesData.map((d) => d.sales),
      backgroundColor: "#3b82f6",
      borderRadius: 8, // закруглені кути
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#e5e7eb" }, // світлі лінії сітки
    },
  },
};

const Dashboard = () => {
  return (
    <div className="p-4 h-[79vh]">
      {/* Заголовок */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Адмін Панель</h1>
        <p className="text-lg mt-2">
          Ласкаво просимо! Тут ви можете переглядати статистику продажів.
        </p>
      </div>

      {/* Карточки з показниками */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="shadow-md text-center">
          <h2 className="text-xl font-semibold">Дохід</h2>
          <p className="text-2xl font-bold text-green-600 mt-2">$45,200</p>
        </Card>

        <Card className="shadow-md text-center">
          <h2 className="text-xl font-semibold">Замовлення</h2>
          <p className="text-2xl font-bold text-blue-600 mt-2">1,240</p>
        </Card>

        <Card className="shadow-md text-center">
          <h2 className="text-xl font-semibold">Користувачі</h2>
          <p className="text-2xl font-bold text-purple-600 mt-2">320</p>
        </Card>
      </div>

      {/* Графік продажів */}
      <Card className="shadow-md p-4">
        <h2 className="text-xl font-semibold text-center mb-4">
          Аналітика продажів за рік
        </h2>
        <div className="w-full h-96 mx-auto">
          <Bar data={data} options={options} />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
