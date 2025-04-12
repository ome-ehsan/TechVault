import { Order } from "../model/orderModel.js";
import { Product } from "../model/productModel.js";
import SSLCommerzPayment from 'sslcommerz-lts';
import dotenv from 'dotenv';
dotenv.config();


const storeId = process.env.SSL_STORE_ID;
const storePass = process.env.SSL_STORE_PASS;
const isLive = false;
const ssl = new SSLCommerzPayment(storeId, storePass, isLive);

export const orderController = async (req, res) => {
  try {
    // discount data 
    
    const disMap = { "bronze" : 0, "silver" : 0.05, "gold" : 0.1 };
    const { items, shippingInfo } = req.body;
    const userId = req.user?._id;
    const loayltylvl = req.user?.loyaltyLevel;
    

    if (!userId || !items || !shippingInfo) {
      return res.status(400).json({ msg: "Insufficient Data Provided" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "No items in order." });
    }

    // Extract all podss
    const productIds = items.map(item => item.productId);

    // Fetch products 
    const products = await Product.find({ _id: { $in: productIds } });

    // Create prod map
    const prodMap = {};
    products.forEach(product => {
      prodMap[product._id.toString()] = product;
    });
    
    // Validate and calculate total
    let total = 0;
    const validProducts = [];

    for (const item of items) {
      const prod = prodMap[item.productId];
      if (!prod) {
        return res.status(400).json({ msg: `Invalid product: ${item.productId}` });
      }

      const quantity = item.quantity || 1;
      total += prod.price * quantity;

      validProducts.push({
        productId: prod._id,
        prodName : prod.name,
        quantity,
      });
    }
    
    // dis calculation
    if (loayltylvl !== "Gold"){
      total += 150; // shipping cost
    }
    // rank calc
    total -= total*disMap[loayltylvl];
    if( total < 0 ) total == 0 ;
    // Create order
    
    const newOrder = new Order({
      userId,
      items: validProducts,
      total,
      shippingInfo,
    });

    await newOrder.save();
    return res.status(201).json({
        msg : "Order placed successfully",
        newOrder
    });
  } catch (error) {
    console.log("Order Controller Error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


export const sslController = async ( req,res)=> {
  try {
      
      const {customerInfo,shippingInfo,order}  = req.body;
      // creating unique tran ID
      const tranId = `SSL-${order._id}-TechVault`;
      // extract cust info from req.user
      const custName = req.user?.name || customerInfo.name;
      const custEmail = req.user?.email || customerInfo.email;
      const custPhone = req.user?.phone || customerInfo.phone;
      
      const data = {
        total_amount: order.total,
        currency: 'BDT',
        tran_id: tranId, 
        value_a: order._id,
        success_url: `http://localhost:8000/api/payment/success`,
        fail_url: 'http://localhost:8000/api/payment/failure',
        cancel_url: 'http://localhost:8000/api/payment/cancel',
        ipn_url: 'http://localhost:8000/api/payment/ipn',
        shipping_method: 'Courier',
        product_name: order.items.map(prod => prod.prodName).join(", "),
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: custName,
        cus_email: custEmail,
        cus_add1: customerInfo.address,
        cus_state: customerInfo.district,
        cus_postcode: customerInfo.postcode,
        cus_country: 'Bangladesh',
        cus_phone: custPhone,
        ship_name: shippingInfo.name || customerInfo.name,
        ship_add1: shippingInfo.address || customerInfo.address,
        ship_city: shippingInfo.city || customerInfo.city,
        ship_state: shippingInfo.district || customerInfo.district, 
        ship_postcode: shippingInfo.postcode || customerInfo.postcode,
        ship_country: 'Bangladesh',
    };
    // init payment
    const paymentData = await ssl.init(data);
    if(paymentData?.GatewayPageURL){
      return res.status(200).json({
        success : true,
        url: paymentData.GatewayPageURL,
        order
      });
    }else{
      // if failed
      await Order.findByIdAndUpdate(order._id, { paymentStatus : 'failed'});
      return res.status(400).json({
        success: false,
        msg: 'SSL Commerz payment initialization failed',
      });
    }
  } catch (error) {
    console.log("Error in sslcontroller:", error);
    return res.status(500).json({
      msg : "Internal server error",
      success: false
    });
  }
}


export const paymentSuccessController = async (req, res) => {
  try {
    const { tran_id } = req.body;
    const orderId = tran_id.split("-")[1];
    await Order.findByIdAndUpdate(orderId, { paymentStatus : "paid", tranId: tran_id});
    res.redirect(`http://localhost:5173/success`);
  } catch (error) {
    console.error('Error in payment process:', error);
    res.redirect("http://localhost:5173");
  }
};

export const paymentFailureController = async (req, res) => {
  try {
    const { tran_id } = req.body;
    const orderId = tran_id.split("-")[1];
    await Order.findByIdAndUpdate(orderId, { paymentStatus : "failed", tranId: tran_id});
    res.redirect(`http://localhost:5173/failure`);
  } catch (error) {
    console.error('Error in payment process:', error);
    res.redirect("http://localhost:5173");
  }
};