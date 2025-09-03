import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAppSelector } from "../store/store";

interface CartProtectedRouteProps {
  children: ReactNode;
}

const CartRoutes: React.FC<CartProtectedRouteProps> = ({ children }) => {
  const { user } = useAppSelector(state => state.auth);
  const { cart } = useCart(!!user);

  if (!cart || cart.length == 0) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default CartRoutes;
