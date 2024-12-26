import { useSearchParams,useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import './Verify.css'
import { StoreContext } from '../../context/StoreContext';
import axios from "axios"
import { useEffect } from 'react';

const Verify = () => {

    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const response = await axios.post(url+"/api/order/verify",{success,orderId});
        if (response.data.success) {
            navigate("/myorders");
        } else {
            navigate("/")
        }
    }
    //here if your payment is complete and successful you will be routed to myorders else home page if we cancel payment
    useEffect(()=>{
        verifyPayment();
    },[])

  return (
    <div className='verify'>
    <div className="spinner"></div>
    </div>
  )
}

export default Verify
