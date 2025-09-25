import { useSelector, useDispatch } from 'react-redux';
import type {RootState} from '../store/store.ts';
import { useGetCartQuery, useCreateUpdateCartMutation, useRemoveCartItemMutation } from '../services/cartApi.ts';
import {addItem, type ICartItem, removeItem} from '../store/slices/localCartSlice.ts';

export const useCart = (isAuth: boolean) => {
    const dispatch = useDispatch();
    const localCart = useSelector((state: RootState) => state.localCart.items);

    const { data: remoteCart, ...remote } = useGetCartQuery(undefined, { skip: !isAuth });
    const [addRemote] = useCreateUpdateCartMutation();
    const [removeRemote] = useRemoveCartItemMutation();

    const addToCart = async (item: ICartItem) => {
        if (isAuth) {
            console.log("Add remote cart", item);
            const existing = remoteCart?.find(i => i.productId === item.productId);
            const quantity = existing ? existing.quantity! + item.quantity! : item.quantity!;           
            await addRemote({ ...item, quantity });
        } else {
             console.log('Додаю в localCart:', item);

            dispatch(addItem(item));
        }
    };

    const removeFromCart = async (productId: number) => {
        if (isAuth) {
            await removeRemote(productId);
        } else {
            dispatch(removeItem(productId));
        }
    };

    return {
        cart: isAuth ? remoteCart ?? [] : localCart,
        addToCart,
        removeFromCart,
        ...remote,
    };
};