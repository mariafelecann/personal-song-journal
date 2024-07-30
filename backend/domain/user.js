const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = "9t2Z$Pb6qC#L@4X^7Y!5mF8sG3hA&zE*";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: "users" }
);

userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: "1h" });
  return token;
};

userSchema.methods.validatePassword = function (password) {
  return password === this.password;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
