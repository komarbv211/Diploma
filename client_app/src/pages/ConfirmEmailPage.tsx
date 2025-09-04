import { useEffect } from "react";
import { useConfirmEmailMutation } from "../services/authApi";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConfirmEmailPage = () => {
    const [confirmEmail, { isLoading, isSuccess, isError }] =
        useConfirmEmailMutation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const userId = params.get("userId");

        if (token && userId) {
            confirmEmail({ userId: Number(userId), token });
        }
    }, [confirmEmail]);

    // ⏳ Автоматичний редирект через 3 сек після успіху
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center max-w-md w-full">
                {isLoading && (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                        <p className="text-gray-600">Підтвердження електронної пошти...</p>
                    </div>
                )}

                {isSuccess && (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                        <p className="text-green-600 font-semibold">
                            Email підтверджено успішно 🎉
                        </p>
                        <p className="text-gray-500 text-sm">
                            Ви будете перенаправлені на сторінку входу.
                        </p>
                    </div>
                )}

                {isError && (
                    <div className="flex flex-col items-center gap-2">
                        <XCircle className="w-10 h-10 text-red-500" />
                        <p className="text-red-600 font-semibold">Помилка підтвердження 😢</p>
                        <p className="text-gray-500 text-sm">
                            Можливо, посилання вже використане або застаріле.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmEmailPage;
