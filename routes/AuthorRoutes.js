const express = require("express");
const router = express.Router();

//import controllers

const {
  createAuthor,
  getAuthor,
  getEnableAuthor,
  updateAuthor,
  deleteAuthor,
  getAllAuthorName,
  getAuthorById,
} = require("../controllers/AuthorController");

//define API Routes

router.post("/createAuthor", createAuthor);
router.get("/getAuthors", getAuthor);
router.get("/getEnableAuthor", getEnableAuthor);
router.put("/updateAuthor", updateAuthor);
router.delete("/deleteAuthor", deleteAuthor);
router.get("/getAllAuthorName", getAllAuthorName);
//get author data by id
router.post("/getAuthorById", getAuthorById);

module.exports = router;
