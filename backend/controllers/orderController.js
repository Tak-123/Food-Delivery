import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"

//setting up stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//placing user order from frontend
const placeOrder = async (req,res) => {

    const frontend_url = "http://localhost:5174"; 

    try {
        const newOrder = new orderModel({//creating new order
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();//save the model in the database
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});//clears cart items from data

        //create payment link using stripe
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"usd",
                product_data:{
                    name:item.name
                },                       //necessary for stripe payments
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))
        //pushing the delivery charges
        line_items.push({
            price_data:{
                currency:"usd",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,//if payment is successful it will go to this page
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,//if payment is unsuccessful it will go to this page
        })

        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

//temporary payment verification system
const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// user orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})  // youll get all order details
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

//listing orders for admin panel
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({}); //youll get all order details in this constant
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

// api for updating order status
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}