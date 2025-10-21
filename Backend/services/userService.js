const User = require("../models/User");
const jwt = require("jsonwebtoken");

class UserService {
  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "24h",
    });
  }

  static async findUser(email){
    const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("true")
        return true;
      }
      return false
  }
  static async createUser(userData) {
    try {
      // Check if user exists.
      console.log("true")
      const user = await User.create(userData);
      const token = this.generateToken(user._id);
      return { user, token };
    } catch (error) {
      console.log(error)
      throw new Error(error.message);
    }
  }

  static async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      if (!user || !(await user.comparePassword(password))) {
        throw new Error("Invalid email or password");
      }
      const token = this.generateToken(user._id);
      return { user, token };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  static async updateUserProfile(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserService;
