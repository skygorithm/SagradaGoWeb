import { useContext, useEffect, useState } from "react"
import { NavbarContext } from "../../context/AllContext";
import { useNavigate } from "react-router-dom";




export default function PaymentMethod() {

    const { getTotalAmount } = useContext(NavbarContext);
    const [paymentMethod, setPaymentMethod] = useState("");

    const navigate = useNavigate();

    function handlePayment() {
        if (paymentMethod === "gcash") {
            alert("You have chosen to pay with GCash. Please scan the QR code displayed on the screen to complete your payment.");
        } else if (paymentMethod === "paymaya") {
            alert("You have chosen to pay with PayMaya. Please scan the QR code displayed on the screen to complete your payment.");
        }
        else{
            alert("You have chosen to pay with cash. Please prepare the exact amount and present it to the cashier upon arrival.");
        }

        navigate("/");


    }

    return (
        <>


            <div className="w-full py-7! px-4! bg-red-400 flex flex-col items-center justify-center gap-3">

                <select
    className="p-2 rounded py-2 px-4 border border-black focus:outline-none focus:ring focus:ring-black w-40"
    value={paymentMethod}
    onChange={(e) => setPaymentMethod(e.target.value)}
>
    <option value="" hidden>Select Payment</option>
    <option value="cash">Cash</option>
    <option value="gcash">GCash</option>
    <option value="paymaya">PayMaya</option>
</select>


                <h1>Amount to pay: {getTotalAmount}</h1>

                {paymentMethod === "gcash" && (
                    <div className="w-40 h-40 bg-green-300"></div>
                )}

                {paymentMethod === "paymaya" && (
                    <div className="w-40 h-40 bg-blue-300"></div>
                )}

                <button className="p-4! bg-white rounded-xl hover:bg-gray-400!" onClick={handlePayment}>
                    Confirm Payment
                </button>

            </div>



        </>
    )
}