// merupakan type action yang bisa dipas ke parameter counterReducer
// atau di gunakan sebgai kembalian function
//(ACTION TYPE)
export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export const DECREMENT_COUNTER = "DECREMENT_COUNTER";

//1/ menginisialisasi state dan interfacenya
export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 42,
    title: 'YARC (yet another redux counter)'
}

//2. membuat function yang akan didispatch ke action pada counterReducer
// yang mengembalikan type action dan payload actionnya
//(ACTION CREATEOR)
export function increment(amount = 1) {
    return{
        type: INCREMENT_COUNTER,
        payload: amount
    }
}

export function decrement(amount = 1) {
    return{
        type: DECREMENT_COUNTER,
        payload: amount
    }
}

interface CounterAction {
    type: string
    payload: number
}

//3. membuat reducernya dan dicreate pada configureStore
// saat melakukan perubahan state pada redux, dilarang untuk
// langsung memutasi statenya, oleh karena itu kita perlu membuat copy
// dari state tersebut menggunakan spread operatornya terlebih dahulu.
export default function CounterReducer(state = initialState, action: CounterAction)  {
    switch(action.type) {
        case INCREMENT_COUNTER:
            return {
                ...state,
                data: state.data + action.payload
            }
        case DECREMENT_COUNTER:
            return {
                ...state,
                data: state.data - action.payload
            }
            default:
                return state;
    }
    return state;
}