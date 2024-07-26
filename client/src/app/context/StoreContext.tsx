import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/basket";

//1. membuat reactcontext yang isinya adalah properti state dan function yang dibutuhkan
interface StoreContextValue {
    basket: Basket | null;
    setBasket: (basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

//2. membuat reactcontext yang harus memiliki properti yang ada pada storecontextvalue
// jika tidak ada maka nilainya undefined
export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

//3. menggunakan context yang sudah dibuat pada tahap kedua
// bila context tidak ada maka kita lempar error message
export function useStoreContext() {
    const context = useContext(StoreContext);

    if(context === undefined) {
        throw Error("Oops - we do not seem to be inside the provider");
    }
    
    return context;
}

//4. kita buat providernya agar storecontextnya dapat diakses oleh component yang dibungkus oleh StoreProvider
// atau state dan function yang dibuat tersebut dapat di passing ke childrennya
export function StoreProvider({children}: PropsWithChildren<unknown>) {
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId: number, quantity: number) {
        if(!basket) return;
        const items = [...basket.items];
        //mengembalikan index yang productIdnya sama dengan yang ada di array items
        const itemIndex = items.findIndex(i => i.productId === productId);
        if(itemIndex >= 0) {
            items[itemIndex].quantity -= quantity;
            if(items[itemIndex].quantity == 0) items.splice(itemIndex, 1);
            setBasket(prevState => {
                // mengubah hanya properti items pada prevState
                // sehingga properti lainnya tidak terpengaruh
                // items mereference kepada const items
                // supaya lebih aman boleh {...prevState!, items: items}
                // tanda seru memastikan bahwa prestate tidak akan bersifat null
                return {...prevState!, items}
            })
        }
    }
    console.log("Basket", basket);
    return (
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}