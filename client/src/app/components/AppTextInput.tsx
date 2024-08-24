import { TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps {
    label: string;
}

export default function AppTextInput(props: Props) {
    const {fieldState, field} = useController({...props, defaultValue: ''})
    //disini method fieldState yang dipakai adalah error
    //dan field methodnya dipakai semua termasuk onchange yang digunakan untuk memberi nilai pada state
    //props nya berisi label dari input tersebut
    return (
        <TextField 
            {...props}
            {...field}
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
    )
}