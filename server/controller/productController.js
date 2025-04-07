import { Product } from "../model/productModel";

export const getProducts = async ( req,res)=> {
    try {
        const {
            category,
            search, // search term 
            priceMin,
            priceMax,
            minWarranty,
            maxWarranty,
            available,
            brand,
            sort,
            order,
            ...specFilters
          } = req.query;

          const { query } = req.query;  

          if(search){
            query.name = { $regex: search, $options: 'i' };
          };

          if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = parseFloat(priceMin);
            if (priceMax) query.price.$lte = parseFloat(priceMax);
          };

          if (minWarranty || maxWarranty) {
            query.warranty = {};
            if (minWarranty) query.warranty.$gte = parseFloat(minWarranty);
            if (maxWarranty) query.warranty.$lte = parseFloat(maxWarranty);
          };

          if (available === 'true') {
            query.quantity = { $gt: 0 };
          }
          
          // now for the category specific filters 
          for (const spec in specFilters) {
            query[`specification.${spec}`] = specFilters[spec];
          }

          // sort logic

        const sortOptions = {};
        const allowedSortFields = ['price', 'quantity'];

        if (sort.includes('price')) {
        sortOptions['price'] = order === 'desc' ? -1 : 1;
        };
        if (sort.includes('quantity')) {
            sortOptions['quantity'] = order === 'desc' ? -1 : 1;
        };

        const products = await Product.find(query)
        .sort(sortOptions)
        .limit(50); // Optional: adjust or add pagination later

        //success
        res.status(200).json(products);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}