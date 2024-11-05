const express = require("express");
const router = express.Router();

//import controllers

const {
  createCategory,
  getCategory,
  getEnableCategory,
  updatedCategory,
  deleteCategory,
  getAllCategoryName,
} = require("../controllers/CategoryController");

//define API Routes

router.post("/createCategory", createCategory);
router.get("/getCategory", getCategory);
router.get("/getEnableCategory", getEnableCategory);
router.put("/updatedCategory", updatedCategory);
router.delete("/deleteCategory", deleteCategory);
router.get("/getAllCategoryName", getAllCategoryName);

module.exports = router;
