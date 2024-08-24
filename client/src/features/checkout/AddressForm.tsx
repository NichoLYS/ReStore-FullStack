import { Typography, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckBox from "../../app/components/AppCheckBox";

export default function AddressForm() {
  // props control berfungsi untuk mendaftarkan input ke form atau menghubungkan input dengan form state
  // digunakan untuk menghubungkan formstate dgn input
  //karena custom input tidak bisa menggunakan register untuk mendaftarkan input ke form
  //maka dipakailah control
  const { control, formState } = useFormContext(); 

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="fullName" label="full name" />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput control={control} name="address1" label="Address 1" />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput control={control} name="address2" label="Address 2" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="city" label="City" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="state" label="State" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="zip" label="Zipcode" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="country" label="Country" />
          </Grid>
          <Grid item xs={12}>
            <AppCheckBox disabled={!formState.isDirty} control={control} name='saveAddress' label='Save this as the default address' />
          </Grid>
        </Grid>
    </>
  );
}
