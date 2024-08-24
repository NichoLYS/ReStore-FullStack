// import { createStore } from "redux";
// import CounterReducer from "../../features/contact/counterReducer";
import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../../features/basket/basketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { accountSlice } from "../../features/account/accountSlice";


// export function configureStore() {
//     return createStore(CounterReducer);
// }

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer,
        account: accountSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//useAppDispatch berfungsi untuk mengirim action yang dimana function action tersebut akan dieksekusi
export const useAppDispatch = () => useDispatch<AppDispatch>();
//useAppSelector untuk memilih state yang akan digunakan
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;