import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

export default function ContactPage() {
    // // menginisalisasi dispatch dari redux
    // const dispatch = useDispatch();
    // //menggunakan state pada redux
    // const {data, title} = useSelector((state: CounterState) => state)

    const dispatch = useAppDispatch();
    const {data, title} = useAppSelector(state => state.counter);

    return(
        <>
        <Typography variant="h2">
            {title}
        </Typography>
        <Typography variant="h5">
            The data is : {data}
        </Typography>
        <ButtonGroup>
            {/* function dispatch akan mengirim type dan payload tersebut ke parameter
            action yang ada dicounterSlice melalui hasil return function decrement atau increment, 
            setelah itu dia akan menjalankan function yang ada di dalam reducer tersebut*/}
            <Button onClick={() => dispatch(decrement(1))} variant="contained" color="error">Decrement</Button>
            <Button onClick={() => dispatch(increment(1))} variant="contained" color="primary">Increment</Button>
            <Button onClick={() => dispatch(increment(5))} variant="contained" color="secondary">Increment By 5</Button>
        </ButtonGroup>
        </>
    )
}