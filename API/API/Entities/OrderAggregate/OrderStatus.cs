namespace API.Entities.OrderAggregate
{
    //enum cocok digunakan saat Anda memiliki satu set nilai yang telah ditentukan
    //dan tidak berubah, dan nilai-nilai ini adalah semantik yang terkait erat.
    public enum OrderStatus
    {
        Pending,
        PaymentReceived,
        PaymentFailed
    }
}
