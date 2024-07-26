import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import agent from "../../app/api/agent";

interface BasketState {
    basket: Basket | null;
    status: string;
}

const initialState: BasketState = {
    basket: null,
    status: "idle"
}

//function yang digunakan untuk melakukan addItem ke api secara asynchronus
// pada async function ini kita buat dulu base nama action typenya pada argumen pertama,
// setelah itu barula dibuat function asyncnya yang menerima parameter productId dan quantity
// (pada createAsyncThunk Basket merupakan tipe functionnya, sedangkan argumen keduanya merupakan action yang dipassing dari dispatch didepan)
export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>(
    'basket/addBasketItemAsync',
    async({productId, quantity = 1}, thunkAPI) => {
        try {
            return await agent.Basket.addItem(productId, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)
// pada extraReducer bagian function removeItemsAsync menggunakan nilai productId dan quantity dari argumen createAsyncThunk,
// bukan berasal dari method async yang ada di dalam createAsyncThunk. Sedangkan createAsyncThunk mendapat nilai argumennya, dari dispatch yang berisi
// action removeItemAsync dari button yang mengklik dan createAsynThunk akan menerima nya dan mengirimnya ke meta data dan dipakai di removeItemASync.
// jadi walaupun kita kasih quantity = 1 pada method di dalam createASyncThunk, maka tidak akan dipakai ke extraReducernya
export const removeBasketItemAsync = createAsyncThunk<void, {productId: number, quantity: number, name?: string}>(
    'basket/removeBasketItemAsync',
    async({productId, quantity}, thunkAPI) => {
        try {
            await agent.Basket.removeItem(productId, quantity);
        } catch (error: any) {
           return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        },
        // removeItem: (state, action) => {
        //     const {productId, quantity} = action.payload;
        //     const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
        //     if(itemIndex === -1 || itemIndex === undefined) return;
        //     state.basket!.items[itemIndex].quantity -= quantity;
        //     if(state.basket?.items[itemIndex].quantity === 0) state.basket.items.splice(itemIndex, 1);
        // }
    },
    // extraReducer dibuat untuk menghandle asyncfunction diatas
    // yang memiliki tiga action type yaitu pending, fulfilled, dan rejected
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            console.log(action);
            state.status = 'pendingAddItem' + action.meta.arg.productId;
            console.log(state.status)
        });
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            state.basket = action.payload;
            state.status = 'idle';
        });
        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
            // mengconsole hasil return thunkAPI.rejectWithValue({error: error.data})
            // yang berada di action.payload
            console.log(action.payload)
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const {productId, quantity} = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
            if(itemIndex === -1 || itemIndex === undefined) return;
            state.basket!.items[itemIndex].quantity -= quantity;
            if(state.basket?.items[itemIndex].quantity === 0) state.basket.items.splice(itemIndex, 1);
            state.status = 'idle';
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload)
        })
})
})

export const {setBasket} = basketSlice.actions;


