const UserService = require("../services/userService");
const bcrypt = require("bcrypt");

class UserController {
  static async signup(req, res) {
    try {
      console.log("Requested Initiated", req.body);
      const {
        email,
        workEmail,
        password,
        dob,
        phoneNumber, // This now combines countryCode and phone in your frontend
        address,
        visaStatus,
        educationDetails,
        workExpr,
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("UserService.findUser(email)", UserService.findUser(email));
      if (await UserService.findUser(email)) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        const { user, token } = await UserService.createUser({
          email,
          workEmail,
          password: hashedPassword,
          phoneNumber, // Assuming phone is the combined value of countryCode and phone
          dob,
          address,
          visaStatus,
          educationDetails,
          workExpr,
        });

        res.status(201).json({
          success: true,
          token,
          user: {
            email: user.email,
          },
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async login(req, res) {
    try {
      console.log("Requested Initiated", req.body);
      const { email, password } = req.body;
      const { user, token } = await UserService.loginUser(email, password);

      res.json({
        success: true,
        token,
        user: {
          email: user.email,
          education: user.education,
          visaStatus: user.visaStatus,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const user = await UserService.updateUserProfile(req.user.id, req.body);
      res.json({
        success: true,
        user: {
          email: user.email,
          education: user.education,
          visaStatus: user.visaStatus,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = UserController;
