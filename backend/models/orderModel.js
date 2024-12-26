import mongoose from "mongoose"

//create order schema
const orderSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    items:{type:Array,required:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Food Processing"},
    date:{type:Date,default:Date.now()},
    payment:{type:Boolean,default:false}
})
//create order model
const orderModel = mongoose.models.order || mongoose.model("order",orderSchema);
export default orderModel;