const AuthorList = require("../models/AuthorList");
const path = require("path");
const multer = require("multer");
const fs = require("fs").promises; // Using the promises version for async/await
const { json } = require("express");

require("dotenv").config();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "authImg/"); // Set your desired upload directory
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
const uploadMiddleware = upload.single("img");

//create a Author

const authorUrlKey = (input) => {
  const cleanedInput = input.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  const urlKey = `${cleanedInput}`;
  return urlKey;
};

exports.createAuthor = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err, "sss");
      return res.status(500).json({
        success: false,
        message: "Error uploading Image",
      });
    }

    try {
      let { name, shortDescription, authorURLKey, isEnabled } = req.body;

      if (!authorURLKey) {
        authorURLKey = authorUrlKey(name);
      }
      const currentDate = new Date();

      const authorList = await AuthorList.create({
        name,
        shortDescription,
        date: currentDate,
        authorURLKey,
        img: req.file ? req.file.path : null,
        isEnabled,
      });

      return res.status(200).json({
        success: true,
        data: authorList,
        message: "authorList create successfully",
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
exports.getAuthor = async (req, res) => {
  try {
    // author = await AuthorList.find({ isEnabled: true });
    author = await AuthorList.find();

    console.log(author);

    res.status(200).json({
      success: true,
      author,
      message: "All Author get successfully",
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
exports.getEnableAuthor = async (req, res) => {
  try {
    // author = await AuthorList.find({ isEnabled: true });
    author = await AuthorList.find({ isEnabled: true });

    // console.log(author);

    res.status(200).json({
      success: true,
      author,
      message: "All Author get successfully",
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

exports.updateAuthor = async (req, res) => {
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
        AuthorId,
        updatedName,
        updatedShortDescription,
        updatedAuthorURLKey,
        updatedIsEnabled,
      } = req.body;

      const updatedAuthor = await AuthorList.findOne({ _id: AuthorId });
      if (!updatedAuthor) {
        return res.status(404).json({ error: "Author not found " });
      }

      // Check if a new file is uploaded
      if (req.file) {
        // console.log(req.file, "ssas");
        // Delete the existing file if it exists
        if (updatedAuthor.img) {
          try {
            await fs.unlink(updatedAuthor.img); // Delete the file
            // console.log(`Existing file deleted: ${updatedAuthor.img}`);
          } catch (err) {
            console.error(
              `Error deleting existing file: ${updatedAuthor.img}`,
              err
            );
          }
        }

        // Update img file path with the new file
        updatedAuthor.img = req.file.path;
      }

      updatedAuthor.name = updatedName;
      updatedAuthor.shortDescription = updatedShortDescription;
      updatedAuthor.authorURLKey = updatedAuthorURLKey;
      updatedAuthor.isEnabled = updatedIsEnabled;

      await updatedAuthor.save();
      // console.log(updatedAuthor, "aaaa");

      res.json({
        success: true,
        updatedAuthor,
        message: "Accounts updated successfully",
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

exports.deleteAuthor = async (req, res) => {
  try {
    const { AuthorId } = req.body;

    const deletedAuthor = await AuthorList.findOneAndDelete({
      _id: AuthorId,
    });

    if (!deletedAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }

    // Delete associated file if it exists
    if (deletedAuthor.img) {
      try {
        await fs.unlink(deletedAuthor.img); // Delete the file
        // console.log(`File deleted: ${deletedAuthor.img}`);
      } catch (err) {
        console.error(`Error deleting file: ${deletedAuthor.img}`, err);
      }
    }

    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: "Internal Server Error",
    });
  }
};

/////////////////////////////////////////////////////////////////////////////////////////

// get all author Name

exports.getAllAuthorName = async (req, res) => {
  try {
    // Find all documents in the ClientList collection
    const authors = await AuthorList.find({}, "_id name");

    // console.log(authors);

    const authorNames = authors.map((author) => ({
      _id: author._id,
      name: author.name,
    }));

    if (!authorNames) {
      return res.status(404).json({ error: " author Not found:" });
    }

    // console.log(authorNames);

    return res.status(200).json({
      success: true,
      authorNames,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/////////////////////////////////////////////////////////////////////////////////////////

//get Author data By Id

exports.getAuthorById = async (req, res) => {
  try {
    const { authorID } = req.body;

    const authorData = await AuthorList.findOne({
      _id: authorID,
    });

    if (!authorData) {
      return res.status(404).json({ error: "authorData not found" });
    }

    // console.log(authorData, "Detail page found");

    res.status(200).json({
      success: true,
      authorData,
      message: "authorData Get successfully",
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
