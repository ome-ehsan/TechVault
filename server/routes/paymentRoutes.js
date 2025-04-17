import express from 'express'
import { orderController, sslController, paymentSuccessController, paymentFailureController,
        addToCartController, reduceCartItemController
} from '../controller/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';


export const paymentRouter = express.Router();

paymentRouter.post("/order",authenticate,orderController);
paymentRouter.post("/init",authenticate,sslController);
paymentRouter.post("/success", paymentSuccessController);
paymentRouter.post("/failure", paymentFailureController);
//////////////////////imtiaj/////////////////////////
paymentRouter.post("/cart/add", authenticate, addToCartController);
paymentRouter.post("/cart/reduce", authenticate, reduceCartItemController);


