import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore"

export default function RequireAuth() {
    const {user} = useAppSelector(state => state.account);
    const location = useLocation();

    if(!user) {
        //state={{from: location}}  dikirim bersama rute login ke halaman login. 
        //Ini menyimpan lokasi halaman sebelumnya (checkout) yang ingin diakses pengguna sebelum dialihkan ke halaman login.
        //dan state location tersebut dapat diakses melalui useLocation pada halaman login
        return <Navigate to='login' state={{from: location}}/>
    }

    return <Outlet />
}