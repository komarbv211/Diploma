import { toast, ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const baseClassName =
  "rounded-[10px] p-3 shadow-lg flex items-center gap-2 font-manrope text-gray";

const typeBorders: Record<"success" | "error" | "info" | "warn", string> = {
  success: "border border-pink",
  error: "border border-pink2",
  info: "border border-blue2",
  warn: "border border-gray",
};

export function showToast(
  type: "success" | "error" | "info" | "warn",
  message: string,
  icon?: ToastOptions["icon"],  
) {
  toast[type](message, {
    ...baseOptions,
    className: `${baseClassName} ${typeBorders[type]}`,
    icon,
  });
}