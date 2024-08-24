import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

const midLinks = [
    { title: 'catalog', path: '/catalog' },
    { title: 'about', path: '/about' },
    { title: 'contact', path: '/contact' },
]

const rightLinks = [
    { title: 'login', path: '/login' },
    { title: 'register', path: '/register' },
]

const navStyles = {
    color: 'inherit',
    textDecoration: 'none',
    typography: 'h6',
    '&:hover': {
        color: 'grey.500'
    },
    '&.active': {
        color: 'text.secondary'
    }
}

interface Props {
    darkMode: boolean
    handleThemeChange: () => void
}

export default function Header({ handleThemeChange, darkMode }: Props) {
    //memanggil state basket yang telah di isi nilainya dari app.tsx
    // yang mana nilainya tersebut diambil dari api
    //    const {basket} = useStoreContext();
    const { basket } = useAppSelector(state => state.basket);
    const { user } = useAppSelector(state => state.account);
    // fungsi reduce berfungsi untuk mengiterasi setiap elemen pada array
    // dan menerapkan callback function pada setiap elemen di dalam array itu
    // kemudian hasil dari callback function itu akan menjadi suatu nilai tunggal
    // dalam konteks ini callback function bertujuan untuk menambah quantity dari setiap elemen dalam array
    // dan pada argumen kedua reduce kita inisialisasi nilai awal sum sebagai 0
    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0)


    return (
        <AppBar position='static'>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Box display='flex' alignItems='center'>
                    <Typography variant="h6" component={NavLink}
                        to='/'
                        sx={navStyles}
                    >
                        RE-STORE
                    </Typography>
                    <Switch color="secondary" checked={darkMode} onChange={handleThemeChange} />
                </Box>


                <List sx={{ display: 'flex' }}>
                    {midLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/basket' size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    {user ? (
                        <SignedInMenu />
                    ) : (
                        <List sx={{ display: 'flex' }}>
                            {rightLinks.map(({ title, path }) => (
                                <ListItem
                                    component={NavLink}
                                    to={path}
                                    key={path}
                                    sx={navStyles}
                                >
                                    {title.toUpperCase()}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}