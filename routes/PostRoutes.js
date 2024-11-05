const express = require("express");
const router = express.Router();

//import controllers

const {
  createPost,
  getPost,
  getEnablePost,
  updatePost,
  deletePost,
  getPostDataById,
  getAuthorDetailPageData,
} = require("../controllers/PostController");

//define API Routes

router.post("/createPost", createPost);
router.get("/getPost", getPost);
router.get("/getEnablePost", getEnablePost);
router.put("/updatePost", updatePost);
router.delete("/deletePost", deletePost);
//get post data by Id
router.post("/getPostDataById", getPostDataById);
// get author's all post data by Id
router.post("/getAuthorDetailPageData", getAuthorDetailPageData);

module.exports = router;
