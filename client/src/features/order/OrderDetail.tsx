import { Typography, Grid, Button, Box } from "@mui/material";
import BasketTable from "../basket/BasketTable";
import { Link, useLocation } from "react-router-dom";
import OrderSummary from "./OrderSummary";


export default function OrderDetail() {

  const location = useLocation();
  const { order } = location.state;

  // console.log(location.state)
  // console.log(location.state.order.id)
  return (
    <>
    <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="10px">
      <Typography variant="h4" gutterBottom>
        Order# {order.id} - {order.orderStatus}
      </Typography>
        <Button component={Link} to="/orders" variant="contained" size="medium" sx={{padding: "12px 12px"}}>
          BACK TO ORDERS
        </Button>
      </Box>
      {order &&
        <BasketTable items={order.orderItems} isBasket={false} />}
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <OrderSummary subtotal={order.subtotal} deliveryFee={order.deliveryFee} total={order.total} />
        </Grid>
      </Grid>
    </>
  );
}