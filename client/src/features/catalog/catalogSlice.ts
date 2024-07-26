import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "@reduxjs/toolkit/query";

//entityadapter berfungsi untuk membantu untuk mengelola state dengan cara menormalisai
//data tersebut dalam bentuk id dan objek data tersebut. Jadi entityadapter ini akan memiliki
// dua state yaitu id dan objek dari setiap data tersebut
const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    //thunkApi hrs pada argumen kedua, oleh karena itu kita deklarasikan
    // underscore pada argumen pertama yg berarti argumen kosong (void)
    async (_, thunkAPI) => {
        try {
            return await agent.Catalog.list();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

// fungsi untuk mengambil barang secara individual alias satu jenis barang
// berdasarkan id yang dipassing
export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: 'idle'
    }),
    reducers: {},
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts'
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state,action) => {
            //setAll merupakan sebuah method yang berfungsi untuk mengubah semua entitas yang didalam inititalstate
            //dengan action.payload yang merupakan hasil dari function fetchProductAsync
            productsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle'
        });
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        })
    })
})

// berfungsi untuk menggunakan state pada catalog dan juga ketika state sudah ada maka loadingnya cuman perlu sekali
// karena statenya sudah disimpan di redux bukan pada komponen local
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog)