import { Product } from "../model/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search, // search term 
      priceMin,
      priceMax,
      minWarranty,
      maxWarranty,
      available,
      sort,
      order,
      page = 1,
      limit = 8,
      ...specFilters
    } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if(category){
      query.category = category;
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin);
      if (priceMax) query.price.$lte = parseFloat(priceMax);
    }

    if (minWarranty || maxWarranty) {
      query.warranty = {};
      if (minWarranty) query.warranty.$gte = parseFloat(minWarranty);
      if (maxWarranty) query.warranty.$lte = parseFloat(maxWarranty);
    }

    if (available === 'true') {
      query.quantity = { $gt: 0 };
    }



    // Apply category-specific filters
    for (const spec in specFilters) {
      query[`specification.${spec}`] = specFilters[spec];
    }

    // Sort logic: Check if `sort` is defined and valid
    const sortOptions = {};
    const allowedSortFields = ['price', 'quantity'];

    // Ensure `sort` is defined and valid before using it
    if (sort && allowedSortFields.includes(sort)) {
      sortOptions[sort] = order === 'desc' ? -1 : 1;
    }


    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Success
    res.status(200).json({
      products,
      page: parseInt(page),
      limit: parseInt(limit),
      totalProducts,
      totalPages: Math.ceil(totalProducts / parseInt(limit))
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
