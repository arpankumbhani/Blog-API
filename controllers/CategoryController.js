const CategoryList = require("../models/CategoryList");
const { json } = require("express");

require("dotenv").config();

//create a category

const createUrlKey = (input) => {
  const cleanedInput = input.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  const urlKey = `${cleanedInput}`;
  return urlKey;
};

exports.createCategory = async (req, res) => {
  try {
    let { categoryName, categoryURLKey, isEnabled } = req.body;

    // If categoryURLKey is not provided, generate it from categoryName
    if (!categoryURLKey) {
      categoryURLKey = createUrlKey(categoryName);
    }

    const categoryList = await CategoryList.create({
      categoryName,
      categoryURLKey,
      isEnabled,
    });

    // console.log(categoryList);

    return res.status(200).json({
      success: true,
      data: categoryList,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get All categories

exports.getCategory = async (req, res) => {
  try {
    category = await CategoryList.find();

    res.status(200).json({
      success: true,
      category,
      message: "All category get successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get All enable categories

exports.getEnableCategory = async (req, res) => {
  try {
    enableCategory = await CategoryList.find({ isEnabled: true });

    res.status(200).json({
      success: true,
      enableCategory,
      message: "All category get successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Update a category

exports.updatedCategory = async (req, res) => {
  try {
    let {
      CategoryId,
      updatedCategoryName,
      updatedCategoryURLKey,
      updatedIsEnabled,
    } = req.body;

    const updatedCategory = await CategoryList.findOne({ _id: CategoryId });
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    updatedCategory.categoryName = updatedCategoryName;
    updatedCategory.categoryURLKey = updatedCategoryURLKey;
    updatedCategory.isEnabled = updatedIsEnabled;

    await updatedCategory.save();

    res.json({
      success: true,
      updatedCategory,
      message: "category updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating category",
    });
  }
};
//delete category

exports.deleteCategory = async (req, res) => {
  try {
    const { CategoryId } = req.body;

    const deletedCategory = await CategoryList.findOneAndDelete({
      _id: CategoryId,
    });
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Error deleting category",
    });
  }
};

/////////////////////////////////////////////////////////////////////////////

// get all categories

// get all author Name

exports.getAllCategoryName = async (req, res) => {
  try {
    // Find all documents in the ClientList collection
    const categorys = await CategoryList.find({}, "_id categoryName");

    // console.log(categorys);

    const categoryNames = categorys.map((category) => ({
      _id: category._id,
      categoryName: category.categoryName,
    }));

    if (!categoryNames) {
      return res.status(404).json({ error: " author Not found:" });
    }

    return res.status(200).json({
      success: true,
      categoryNames,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
