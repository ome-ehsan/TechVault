import cld from "./cloudinaryConfig.js";
import { Product } from "../model/productModel.js";

export const uploadPhoto = async (info) => {
    const { productPhoto, prodId } = info;
    try {
        if (!productPhoto) {
            return false;
        }

        const uploadToCld = await cld.uploader.upload(productPhoto);
        const updateProdDb = await Product.findByIdAndUpdate(prodId, { img: uploadToCld.secure_url }, { new: true });
        return updateProdDb;
    } catch (err) {
        console.log("Photo update error: ", err);
        return false;
    }
};
