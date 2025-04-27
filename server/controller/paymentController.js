import { Order } from "../model/orderModel.js";
import { Product } from "../model/productModel.js";
import { User } from "../model/userModel.js";
import SSLCommerzPayment from 'sslcommerz-lts';
import { Types} from "mongoose";
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
    const { items, shippingInfo, customerInfo } = req.body;
    const userId = req.user?._id;
    const loayltylvl = req.user?.loyaltyLevel;
    

    if (!userId || !items || !shippingInfo || !customerInfo) {
      return res.status(400).json({ msg: "Insufficient Data Provided" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "No items in order." });
    }

    // Extract all podss
    const productIds = items.map(item => item.productId);
    console.log(productIds);
    const testProduct = await Product.findOne();



    // Fetch products 
    const products = await Product.find({ _id: { $in: productIds } });
    console.log(products);

    // Create prod map
    const prodMap = {};
    products.forEach(product => {
      prodMap[product._id.toString()] = product;
    });
    
    // Validate and calculate total
    let total = 0;
    const validProducts = [];
    console.log(prodMap)

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
    if( total < 0 ) total = 0 ;
    // Create order
    
    const newOrder = new Order({
      userId,
      items: validProducts,
      total,
      customerInfo,
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
    const orderId = tran_id.split("-")[1]; // could pass the user id too to clear cart if payment is successful
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

//imtiaj: 
// add cart : adds to users model db in cart section but validates with product db model
//clear cart : clears from user model's cart



export const addToCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, updates } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, msg: "User not found." });

    // Handle bulk updates (from updateCart)
    if (Array.isArray(updates)) {
      const errors = [];
      const newCart = [];

      for (const item of updates) {
        const { productId, name, price, quantity } = item;

        if (!productId || typeof quantity !== 'number') {
          errors.push(`Invalid data for product.`);
          continue;
        }

        if (quantity <= 0) {
          errors.push(`Quantity for "${name}" must be greater than 0.`);
          continue;
        }

        const product = await Product.findById(productId);
        if (!product) {
          errors.push(`Product "${name}" not found.`);
          continue;
        }

        if (quantity > product.quantity) {
          errors.push(`"${name}" exceeds available stock (${product.quantity}).`);
          continue;
        }

        newCart.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity
        });
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          msg: errors.join(" "),
        });
      }

      // All valid, update cart
      user.cart = newCart;
      await user.save();

      return res.status(200).json({
        success: true,
        msg: "Cart updated successfully.",
        cart: user.cart
      });
    }

    // Handle single add-to-cart item
    if (!productId || typeof quantity !== 'number') {
      return res.status(400).json({ success: false, msg: "Product ID and valid quantity are required." });
    }

    if (quantity <= 0) {
      return res.status(400).json({ success: false, msg: "Quantity must be greater than 0." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found." });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({ success: false, msg: `Only ${product.quantity} in stock.` });
    }

    const existingItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity += quantity;

      if (user.cart[existingItemIndex].quantity > product.quantity) {
        return res.status(400).json({
          success: false,
          msg: `Exceeds available stock. Only ${product.quantity} in stock.`,
        });
      }
    } else {
      // Add new item
      user.cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Item added to cart.",
      cart: user.cart
    });

  } catch (err) {
    console.error("Cart Update Error:", err);
    return res.status(500).json({
      success: false,
      msg: "Server error while updating the cart."
    });
  }
};


export const clearCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found." });

    user.cart = [];
    await user.save();

    res.status(200).json({ msg: "Cart cleared successfully." });
  } catch (err) {
    console.error("Clear Cart Error:", err);
    res.status(500).json({ msg: "Server error while clearing cart." });
  }
};


export const reduceCartItemController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ msg: "Product ID and valid quantity are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found." });

    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ msg: "Item not found in cart." });
    }

    // Reduce quantity
    user.cart[cartItemIndex].quantity -= quantity;

    if (user.cart[cartItemIndex].quantity <= 0) {
      // Remove item if quantity becomes 0 or negative
      user.cart.splice(cartItemIndex, 1);
    }

    await user.save();
    res.status(200).json({ msg: "Cart updated successfully.", cart: user.cart });
  } catch (err) {
    console.error("Reduce Cart Item Error:", err);
    res.status(500).json({ msg: "Server error while updating cart." });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId })
                              .sort({ createdAt: -1 }) 
                              .skip(skip)
                              .limit(limit);
    
    const totalOrders = await Order.countDocuments({ userId });
    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({
      page,
      totalPages,
      totalOrders,
      orders
    });
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


export const cancelOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    if (!orderId || !userId) {
      return res.status(400).json({ msg: "Invalid orderId or userId" });
    }

    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    const creationDate = new Date(order.createdAt);
    const currentDate = new Date();
    const timeDiff = currentDate - creationDate;
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

    if (timeDiff > sevenDaysInMs) {
      return res.status(400).json({ msg: "Order cancellation is only allowed within 7 days of confirmation" });
    }

    await Order.findByIdAndDelete(orderId);
    return res.status(200).json({ msg: "Order cancelled successfully" });

  } catch (error) {
    console.log("Error cancelling order:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};




