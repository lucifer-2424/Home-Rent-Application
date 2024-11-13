import mongoose from "mongoose";
// Import the Schemas
import { User } from "./Schemas/User.js";
import { Ad } from "./Schemas/Ad.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// For encryption
import bcrypt from "bcrypt";
//For access the env variables
import "dotenv/config";
// For Authentication
import Jwt from "jsonwebtoken";
// to save pictures
import multer from "multer";
//to handle files
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "process";
// My url for the DB
const DBURL = "mongodb://localhost:27017/rentApp";

// My server/ backend port
const port = process.env.REACT_APP_BACKEND_URL || 5000;

// Create the express App:
const app = express();

//MIDDLEWARE
// to get the forms requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// this is to pass static files to the client (the pictures)
app.use("/uploads", express.static("uploads"));

// Set the app to listen in the backend port
app.listen(port, () =>
  console.log(`The app is up and listening in port ${port} `)
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ROUTES FOR CRUD

////////// CREATE A NEW USER///////////
app.post("/api/register", async (req, res) => {
  console.log("Entire Request Object:", req.body);
  // Process the request body
  const { username, email, password } = req.body;

  try {
    // Connect with the database
    await mongoose.connect(DBURL);
    console.log("Data Base connected");
    //try to save the new user
    try {
      // look for that email in the db
      const existingUser = await User.findOne({ email });
      console.log(existingUser);
      // if the user exist
      if (existingUser) {
        return res.status(400).json({ message: "User already exists " });
      }
      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new User:
      const newUser = new User({ username, email, password: hashedPassword });
      try {
        await newUser.save();
        console.log(`User ${newUser.username} created successfully`);
        return res
          .status(201)
          .json(`User ${newUser.username} successfully created`);
      } catch (error) {
        return res
          .status(400)
          .json({ message: `Error while saving the user : ${error} ` });
      }
    } catch (error) {
      console.log(`error saving the user ${error.message}`);
      res
        .status(400)
        .json({ message: `error saving the user ${error.message}` });
    } finally {
      // Disconnect from the Db
      mongoose.disconnect();
    }
  } catch (error) {
    console.log("Error connecting to the Database");
  }
});

////////LOGIN FOR an EXISTING USER//////////////////
app.post("/api/login", async (req, res) => {
  // Handle the request body

  const { email, password } = req.body;

  try {
    // Connect to the data base
    await mongoose.connect(DBURL);
    const user = await User.findOne({ email });
    console.log(user);
    // If no user with that email was found,
    if (!user) {
      return res.send({ message: "user does not exist" }).status(401);
    } else {
      // Check for the password
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        return res.send({ message: "Wrong Password" }).status(401);
      } else {
        // if  the authentication was successful, generate a JWT token for the session, use my key in the .env file
        const token = Jwt.sign(
          { userId: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "7d",
          }
        );
        console.log("this is the token");
        console.log(token);
        // Send the token and the userId to the client
        res.send({ token: token, userId: user.id });
      }
    }
  } catch (error) {
    console.log(`Error accessing the db to login: ${error} `);
    console.log(process.env.ACCESS_TOKEN_SECRET);
    res.status(500).send({ message: "Problem accessing the database" });
  } finally {
    //close the database
    await mongoose.connection.close();
    console.log("connection to db closed");
  }
});

///GET ALL THE ADS////
app.get("/api/ads", async (req, res) => {
  try {
    // Stablish the connection
    await mongoose.connect(DBURL);
    console.log("Connection with db successful");
    try {
      const ads = await Ad.find();
      console.log(ads);
      res.status(200).send(ads);
    } catch (error) {}
  } catch (error) {
    console.log(`error connecting with the db to get all the ads`);
  }
});

//Get A single AD based on the ID
app.get("/api/ads/:id", async (req, res) => {
  // get the ad id from the query params
  const id = req.params.id;
  try {
    //connect with the database
    await mongoose.connect(DBURL);
    console.log(`Connected with the database to get ad by id: ${id}`);
    // Try to get the add
    try {
      const adDetails = await Ad.findById(id);
      console.log(adDetails);
      if (adDetails) {
        res.send(adDetails).status(200);
      } else {
        res.status(404).send("Ad not found");
      }
    } catch (error) {
      `Error trying to find the required Ad ${id}`;
    }
  } catch (error) {
    console.log(`error connecting with the database: ${error}`);
  }
});

///SEARCH ADDS//////// Get ADS based on parameters
app.get("/api/search", async (req, res) => {
  // get the query parameters
  try {
    const query = req.query;
    const queryArray = query.item.split(" ");
    const category = query.category;
    console.log(query);

    // open connection with db
    await mongoose.connect(DBURL);
    console.log("searching items");
    // Search the db
    try {
      const results = await Ad.find({
        //find all elements containing words in the query, case insensitive
        title: { $regex: RegExp(queryArray), $options: "i" },
        category: category,
      });
      if (results.length != 0) {
        console.log(results);
        //send results
        res.send(results);
      } else {
        res.status(404).send("Item not found");
      }
    } catch (error) {
      res.status(500).send("Server error");
      console.log(error);
    }
  } catch (error) {
    res.status(500).send("Server error");
    console.log(`Error during the search ${error}`);
  } finally {
    await mongoose.connection.close();
    console.log("Connection with the DB closed");
  }
});

////////////CREATE A NEW AD FOR A GIVEN USER ////////////////////////////
app.post("/api/ads/create", upload.single("image"), async (req, res) => {
  console.log("request to create ad");
  //Get the token to check authorization
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    res.send({
      success: false,
      message: "Error, authorization missing, please login",
    });
  }

  // Decode the token
  const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const userId = decodedToken.userId;

  // Handle the request body
  // console.log(`this was the request body: ${req.body}`); this causes errors
  console.log(`this was the request body: ${JSON.stringify(req.body)}`);
  const { title, price, description, category, type } = req.body;

  // create the url for the image that has been uploaded
  const imagePath = req.file ? req.file.path : null;
  // Save imagePath in the database without the 'uploads/' prefix
  const relativeImagePath = imagePath
    ? imagePath.replace("uploads\\", "")
    : null;
  // Authentication
  if (!userId) {
    res.status(401).json({ message: "Unauthorized, User not logged in" });
  }

  try {
    // Connect to the database
    await mongoose.connect(DBURL);
    console.log("Connected to the database for creating an ad");

    // Create a new ad with the provided details and user ID
    const newAd = new Ad({
      title: title,
      price: Number(price),
      type: type,
      description: description,
      category: category,
      user: new mongoose.Types.ObjectId(userId),
      image: relativeImagePath, // Save the image path to the database
    });

    try {
      // Save the new ad
      await newAd.save(newAd);
      console.log(`Ad created successfully: ${newAd.title}`);
      res.status(200).json({ message: "Ad created successfully", ad: newAd });
    } catch (error) {
      console.error(`Error while saving the ad: ${error}`);
      res.status(400).json({ message: `Error while saving the ad: ${error}` });
    }
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
    res.status(500).json({ message: "Error connecting to the Database" });
  } finally {
    // Disconnect from the database
    await mongoose.connection.close();
    console.log("Connection to the database closed");
  }
});

/////////////GET THE ADS FOR A GIVEN USER////////
app.get("/api/users/ads", async (req, res) => {
  try {
    //Get the token to check authorization
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.send({
        success: false,
        message: "Error, authorization missing, please login",
      });
    } else {
      // Decode the token
      try {
        const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userId;
        // Connect to the database and find the ads
        try {
          await mongoose.connect(DBURL);
          console.log("connected to get the ads of a particular user");

          // get the ads for a particular user
          const results = await Ad.find({ user: userId });
          // console.log(`This are the results:  ${results}`);
          // res.status(200).json(results);
          res.send(results);
        } catch (error) {
          console.log(`error connecting to the database ${error} `);
          res
            .status(404)
            .json({ message: `error connecting with the Database: ${error}` });
        } finally {
          //close the database
          await mongoose.connection.close();
          console.log("Connection with db closed");
        }
      } catch (error) {
        console.log(`Token verification error: ${error}`);
        res
          .status(500)
          .json({ message: "An error ocurred during authorization" });
      }
    }
  } catch (error) {
    console.log(`Error during authorization: ${error}`);
    res.status(500).json({ message: "An error ocurred during authorization" });
  }
});

//////////////DELETE AN AD Given its ID and authorization level///////////////////////////
app.delete("/api/users/ads/:id", async (req, res) => {
  // Handle the query parameter
  const adId = req.params.id;
  // Check authorization
  try {
    //Get the token to check authorization
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.send({
        success: false,
        message: "Error, authorization missing, please login",
      });
    } else {
      // Decode the token
      try {
        const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userId;
        // Connect to the database and find the ads
        try {
          //open connection
          await mongoose.connect(DBURL);
          const mongoID = new mongoose.Types.ObjectId(adId);
          console.log("Connected to the database to delete an ad");

          //find the ad in the Database
          const addtodelete = await Ad.findById(adId);
          if (!addtodelete) {
            console.log("The ad with the specified ID was not found");
            res
              .status(401)
              .json({ message: "The ad with the specified ID was not found" });
          }
          // Delete the add
          await Ad.findByIdAndDelete(adId);
          console.log(`Ad successfully deleted`);
          res.status(200).json({ message: "Ad was successfully deleted" });
        } catch (error) {
          console.log(error);
          res
            .status(401)
            .json({ message: "error while connecting to the db to delete" });
        } finally {
          await mongoose.connection.close();
          console.log("db connection closed");
        }
      } catch (e) {
        console.log(e);
      }
    }
  } catch (e) {
    console.log(`Authentication error: ${e}`);
  }
});

//////////// UPDATE AN EXISTING AD FOR A GIVEN USER////////
app.put("/api/ads/update/:adId", upload.single("image"), async (req, res) => {
  console.log("Request to update ad");

  // Get the token to check authorization
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Error, authorization missing, please login",
      })
      .send();
  }
  try {
    // Decode the token
    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;

    // Get the ad ID from the request parameters
    const adId = req.params.adId;
    // Check if the user is authorized to update this ad
    const ad = await Ad.findById(adId);
    console.log(ad);
    if (!ad || ad.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden, you don't have permission to update this ad",
      });
    }
    // Handle the request body
    const { title, price, description, category } = req.body;

    // Create the URL for the updated image, if provided
    const imagePath = req.file ? req.file.path : ad.image;
    // Save imagePath in the database without the 'uploads/' prefix
    const relativeImagePath = imagePath
      ? imagePath.replace("uploads\\", "")
      : null;

    try {
      // Connect to the database
      await mongoose.connect(DBURL);
      console.log("Connected to the database for updating an ad");

      // Update the existing ad with the provided details
      ad.title = title;
      ad.price = Number(price);
      ad.description = description;
      ad.category = category;
      ad.image = relativeImagePath || ad.image; // Use the new image path or keep the existing one

      try {
        // Save the updated ad
        await ad.save();
        console.log(`Ad updated successfully: ${ad.title}`);
        res.status(200).json({ message: "Ad updated successfully", ad: ad });
      } catch (error) {
        console.error(`Error while saving the updated ad: ${error}`);
        res.status(400).json({
          message: `Error while saving the updated ad: ${error}`,
        });
      }
    } catch (error) {
      console.error(`Error connecting to the database: ${error}`);
      res.status(500).json({ message: "Error connecting to the Database" });
    } finally {
      // Disconnect from the database
      await mongoose.connection.close();
      console.log("Connection to the database closed");
    }
  } catch (error) {
    console.log("authentication error ");
  }
});
