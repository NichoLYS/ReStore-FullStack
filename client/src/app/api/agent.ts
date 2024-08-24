import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/Pagination";
import { store } from "../store/configureStore";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

//1. membuat base url yang dipakai aaxios//
// axios.defaults.baseURL = 'http://localhost:5262/api/';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// menizinkan aplikasi untuk menyimpan cookie
axios.defaults.withCredentials = true;

//2. mengambil data dari response axios yang data tersebut biasanya dalam bentuk array//
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

//6. Menangani response yang didapat dari api
// yang dimana ketika response berhasil dia akan mereturn response
// dan jika error maka akan mereturn promise.reject(error.response)
// pada case 400 jika terdapat object error pada data
// maka object error tersebut akan dipush ke dalam array modelStateErrors
// dan di throw modelStateError tersebut dan dibuat kedalam bentuk string
// menggunakan .flat()
axios.interceptors.response.use(async response => {
    if(import.meta.env.DEV) await sleep();
    //didalam array response headers axios harus lowercase semua valuenya
    const pagination = response.headers['pagination'];
    if(pagination) {
                // response.data berisi objek produk2 catalog, sedangkan parameter kedua merupakan informasi mengenai paginationnya(Metadata)
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }
    return response
}, (error: AxiosError) => {
    const {data, status} = error.response! as AxiosResponse;
   
    switch(status) {
        case 400:
            if(data.errors) {
                const modelStateErrors: string[] = [];
                for(const key in data.errors) {
                    if(data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            break;
        case 401:
            toast.error(data.title);
            break;
        case 404:
            toast.error(data.title);
            break;
        case 500:
            router.navigate('/server-error', {state: {error: data}});
            break;
        default:
            toast.error('An unexpected error occurred');
            break;
    }
    return Promise.reject(error.response);
})

//3. membuat method request http ke baseUrl dan menampilkan responseBody 
// yang telah diekstrak datanya pada No.2
const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),

}

//4. membuat method list dan detail untuk mengambil list dan detail produk
// yang dimana pada list menggunakan method yang ada pada request
// dan mengirim url tambahan didalam mehthod get nya agar di gabung dengan baseurlnya
const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id: number) => requests.get(`products/${id}`),
    fetchFilters: () => requests.get('products/filters')
}

//5. membuat method untuk mendapatkan response error dari api
const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
    
}

const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress: () => requests.get('account/saveAddress')
}

const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post('orders', values),
   
}

const Payments = {
    createPaymentIntent: () => requests.post('payments', {})  
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Payments
}

export default agent;