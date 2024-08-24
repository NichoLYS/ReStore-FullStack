
import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import HomePage from "../../features/home/HomePage";




function App() {
  // const {setBasket} = useStoreContext();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);


  //UseEffect hanya akan memanggil sekali initApp yang berada didalam useEffect berdasarkan dependencynya
  //kecuali jika ada perubahan pada dispatch yang ada diinitApp
  //barulah useEffect pada initApp aka direrender
  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch])

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp])

  //fetch basket dan current user tanpa async thunk
  // useEffect(() => {
  //   const buyerId = getCookie('buyerId');
  //   dispatch(fetchCurrentUser());
  //   if(buyerId) {
  //     agent.Basket.get()
  //     .then(basket => dispatch(setBasket(basket)))
  //     .catch(error => console.log(error))
  //     .finally(() => setLoading(false));
  //   } else {
  //     setLoading(false)
  //   }
  // }, [dispatch])

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType == 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      {/* jika loading ada maka tampilkan loading component
      jika locationnya adalah slash maka tampilkan HomePage
      jika loading dan location tidak memenuhi kondisi maka tampilkan konten route melalui outlet */}
      {loading ? <LoadingComponent message="initialising app..." />
        : location.pathname === '/' ? <HomePage />
          : <Container sx={{ mt: 4 }}>
            {/*dibungkus pake container biar rapih catalognya */}
            <Outlet />
          </Container>}

    </ThemeProvider>
  )
}

export default App
