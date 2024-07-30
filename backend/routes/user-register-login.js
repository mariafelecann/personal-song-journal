const express = require("express");
const router = express.Router();
const User = require("../domain/user");
const session = require("express-session");
const secretKey = "9t2Z$Pb6qC#L@4X^7Y!5mF8sG3hA&zE*";
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const dbUri =
  "mongodb+srv://mariafelecan19:doamneajuta@songjournal.xogtvqh.mongodb.net/?retryWrites=true&w=majority&appName=SongJournal";

mongoose
  .connect(dbUri)
  .then(() => console.log("Connected to MongoDB for user authentication"))
  .catch((err) =>
    console.error("Failed to connect to MongoDB for user authenticaton", err)
  );

router.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
  })
);

const authenticateSession = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).send({ error: "Unauthorized. Please log in." });
  }
};
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("no token");
    return res.status(401).send({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(token);
    console.error("Token verification error:", error);
    res.status(400).send({ error: "Invalid token." });
  }
};

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send({ error: "Logout failed." });
    } else {
      res.clearCookie("connect.sid");
      res.send({ message: "Logout successful." });
    }
  });
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    const token = user.generateAuthToken();
    req.session.user = { _id: user._id };
    res.status(201).send({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !user.validatePassword(password)) {
      throw new Error("Invalid username or password.");
    }
    const token = user.generateAuthToken();
    req.session.user = { _id: user._id };
    res.send({ token });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

router.get("/protectedRoute", verifyToken, async (req, res) => {
  res.send({ message: "You have access to this route." });
});
module.exports = router;
