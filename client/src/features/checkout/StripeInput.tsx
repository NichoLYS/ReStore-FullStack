import { InputBaseComponentProps } from "@mui/material";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";

interface Props extends InputBaseComponentProps { }

export const StripeInput = forwardRef(function StripeInput({ component: Component, ...props }: Props,
    ref: Ref<unknown>) {
        //menggunakan useRef untuk menerima referensi dari elemen stripe cthnya CardNumberElement
    const elementRef = useRef<any>();
        //mengekspos fungsi focus agar dapat digunakan di komponen induk (paymentForm)
    useImperativeHandle(ref, () => ({
        focus: () => elementRef.current.focus
    }));

    return (
        
        <Component
        //onReady adalah callback yang dipanggil ketika elemen Stripe siap (mounted). Ketika ini terjadi, elemen Stripe (CardNumberElement) dioper ke callback onReady
        //Callback onReady ini kemudian menetapkan elemen Stripe yang sebenarnya (element) ke elementRef.current
            onReady={(element: any) => elementRef.current = element}
            {...props} />
    )
})