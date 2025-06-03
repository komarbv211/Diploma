import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <section className="flex items-center justify-center pt-[200px] px-4">
            <div className="max-w-screen-sm text-center">
                <h1 className="text-8xl text-gray-700 font-bold mb-4">404</h1>
                <p className="text-3xl font-bold text-gray-700 dark:text-white mb-2">Сторінку не знайдено</p>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Вибач, такої сторінки не існує...</p>
                <Link to="/" className="py-2 px-8 text-sm font-medium focus:outline-none bg-white rounded-full border border-gray-400 hover:bg-gray-100 hover:text-blue-700">
                    На головну
                </Link>
            </div>
        </section>
    );
}

export default NotFoundPage;
