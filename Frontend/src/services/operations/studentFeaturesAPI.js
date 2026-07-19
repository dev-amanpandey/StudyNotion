import { toast } from "react-hot-toast";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
//import { apiConnector } from "../apiconnector";
//import { resetCart } from "../../slices/cartSlice";


import { apiConnector } from "../apiconnector";
import { studentEndpoints } from "../apis";
import { resetCart } from "../../slices/cartSlice";
//import { setPaymentLoading } from "../../slices/paymentSlice";

const { COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
 } = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

export async function buyCourse(token, courses, user, navigate, dispatch) {
  const toastId = toast.loading("Loading...");

  try {
    if (!Array.isArray(courses) || courses.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!sdkLoaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!orderResponse?.data?.success) {
      throw new Error(orderResponse?.data?.message || "Unable to create payment order");
    }

    const order = orderResponse.data.data;
    if (!order?.id || !order?.amount || !order?.currency) {
      throw new Error("The payment order returned by the server is incomplete");
    }
console.log(
  "RAZORPAY KEY VALUE:",
  process.env.REACT_APP_RAZORPAY_KEY
)
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      currency: order.currency,
      amount: `${order.amount}`,
      order_id: order.id,
      name: "StudyNotion",
      description: "Thank you for purchasing the course",
      image: rzpLogo,
      prefill: {
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        email: user?.email || "",
      },
      handler: async function (response) {
        // if (response?.razorpay_payment_id) {
        //   toast.success("Payment successful");
        //   dispatch(resetCart());
        //   navigate("/dashboard/enrolled-courses");
        //   return;
        // }

        // toast.error("Payment could not be completed");
        sendPaymentSuccessEmail(response, order.amount, token);


        verifyPayment({...response,courses},token,navigate,dispatch);

        
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function () {
      toast.error("Payment failed");
    });
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    toast.error(
      status === 401
        ? `${message || "Your session is no longer valid"}. Please sign in with a Student account and try again.`
        : message || error?.message || "Could not initiate payment"
    );
  } finally {
    toast.dismiss(toastId);
  }
}

async function sendPaymentSuccessEmail(response,amount,token){
//  const {orderId,paymentId, amount} = req.body;
//  const userId = req.user.id;

//  if(!orderId || !paymentId || !amount || !userId){
//   return res.status(400).json({success:false, message:"please provide all the fields"});
//  }
try{
  await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
    orderId: response.razorpay_order_id,
    paymentId: response.razorpay_payment_id,
    amount,
  },{
    Authorization: `Bearer ${token}`
  })

}catch(error){
  console.log("Payment success email error",error)

}
}

export async function verifyPayment(bodyData,token,navigate,dispatch){
const toastId = toast.loading("Verifying Payment...");
//dispatch(setPaymentLoading(true));
try{
  const response = await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
    Authorization: `Bearer ${token}`,
  })
  if(!response?.data?.success){
    throw new Error(response?.data?.message || "Payment verification failed");
  }
  toast.success("Payment successful");
  navigate("/dashboard/enrolled-courses");
  dispatch(resetCart());

}catch(error){
  console.log("payment verification error",error);
  toast.error("could not verify payment");


}
toast.dismiss(toastId);
//dispatch(setPaymentLoading(false));
}
