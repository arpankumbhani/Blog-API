const PostList = require("../models/PostList");
const path = require("path");
const multer = require("multer");
const fs = require("fs").promises; // Using the promises version for async/await
const { json } = require("express");

require("dotenv").config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "postImages/"); // Set your desired upload directory
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/gif"
    ) {
      callback(null, true);
    } else {
      console.log("Only jpg & png files are supported");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 4, // 10 MB file size limit
  },
});

// Middleware to handle file upload
const uploadMiddleware = upload.single("postImg");

//create Post

const postUrlKey = (input) => {
  const cleanedInput = input.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  const urlKey = `${cleanedInput}`;
  return urlKey;
};

exports.createPost = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err, "sss");
      return res.status(500).json({
        success: false,
        message: "Error uploading Image",
      });
    }

    try {
      let {
        title,
        authorId,
        shortDescription,
        categoryId,
        postDescriptions,
        postURLKey,
        isEnabled,
      } = req.body;

      if (!postURLKey || postURLKey === "" || postURLKey === undefined) {
        postURLKey = postUrlKey(title);
      }

      const postList = await PostList.create({
        title,
        authorId,
        shortDescription,
        categoryId,
        postDescriptions,
        postURLKey,
        postImg: req.file ? req.file.path : null,
        isEnabled,
      });

      return res.status(200).json({
        success: true,
        data: postList,
        message: "PostList create successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
};

// get all accounts data
exports.getPost = async (req, res) => {
  try {
    // author = await AuthorList.find({ isEnabled: true });
    post = await PostList.find();

    // console.log(post);

    res.status(200).json({
      success: true,
      post,
      message: "All post get successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all accounts data
exports.getEnablePost = async (req, res) => {
  try {
    // author = await AuthorList.find({ isEnabled: true });
    enablePost = await PostList.find({ isEnabled: true });

    res.status(200).json({
      success: true,
      enablePost,
      message: "All post get successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update Author data

exports.updatePost = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error uploading img",
      });
    }
    try {
      const {
        PostId,
        updatedTitle,
        updatedAuthorId,
        updatedShortDescription,
        updatedCategoryId,
        updatedPostDescriptions,
        updatedPostURLKey,
        updatedIsEnabled,
      } = req.body;

      const updatedPost = await PostList.findOne({ _id: PostId });
      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found " });
      }

      // Check if a new file is uploaded
      if (req.file) {
        // console.log(req.file, "ssas");
        // Delete the existing file if it exists
        if (updatedPost.postImg) {
          try {
            await fs.unlink(updatedPost.postImg); // Delete the file
            // console.log(`Existing file deleted: ${updatedAuthor.postImg}`);
          } catch (err) {
            console.error(
              `Error deleting existing file: ${updatedPost.postImg}`,
              err
            );
          }
        }

        // Update postImg file path with the new file
        updatedPost.postImg = req.file.path;
      }

      updatedPost.title = updatedTitle;
      updatedPost.authorId = updatedAuthorId;
      updatedPost.shortDescription = updatedShortDescription;
      updatedPost.categoryId = updatedCategoryId;
      updatedPost.postDescriptions = updatedPostDescriptions;
      updatedPost.postURLKey = updatedPostURLKey;
      updatedPost.isEnabled = updatedIsEnabled;

      await updatedPost.save();
      // console.log(updatedPost, "aaaa");

      res.json({
        success: true,
        updatedPost,
        message: "Post updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
        error: "Internal Server Error",
      });
    }
  });
};

exports.deletePost = async (req, res) => {
  try {
    const { PostId } = req.body;

    const deletedPost = await PostList.findOneAndDelete({
      _id: PostId,
    });

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete associated file if it exists
    if (deletedPost.postImg) {
      try {
        await fs.unlink(deletedPost.postImg); // Delete the file
        // console.log(`File deleted: ${deletedPost.postImg}`);
      } catch (err) {
        console.error(`Error deleting file: ${deletedPost.postImg}`, err);
      }
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: "Internal Server Error",
    });
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
//get post data by Id

exports.getPostDataById = async (req, res) => {
  try {
    const { postID } = req.body;

    const postData = await PostList.findOne({
      _id: postID,
    });

    if (!postData) {
      return res.status(404).json({ error: "postData not found" });
    }

    // console.log(postData, "Detail page found");

    res.status(200).json({
      success: true,
      postData,
      message: "postData Get successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: "Internal Server Error",
    });
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

// get author's all post data by Id

exports.getAuthorDetailPageData = async (req, res) => {
  try {
    const { authorID } = req.body;

    const authorId = authorID;

    // console.log(authorId, "ddd");

    const authorsPostData = await PostList.find({ authorId });

    // console.log(authorsPostData, "authorsPostData");

    if (!authorsPostData || authorsPostData.length === 0) {
      return res
        .status(404)
        .json({ error: "Data not found for the provided authorId" });
    }

    res.status(200).json({
      success: true,
      authorsPostData,
      message: "postData Get successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: "Internal Server Error",
    });
  }
};
