const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");

require("dotenv").config();

const signUp = async (c) => {
  try {    
    const { username, email, password } = await c.req.json();

    if (!username || !email || !password) {
      return c.json({ message: "Username, email, and password are required" }, 400);
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return c.json({ message: "Username is already exists." }, 400);
    }

const existingUserEmail= await User.findOne({ email });
    if (existingUserEmail) {
      return c.json({ message: "Email is already registered." }, 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = new User({ username, email, passwordHash,});
    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id ,username:newUser.username,email:newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "30h", 
    });

    return c.json({
      message: "Signup successful",
      token, 
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Internal server error", details: error.message }, 500);
  }
};







const signIn = async (c) => {
  try {
   

    
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

   
    const user = await User.findOne({ email });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

     
    if (!user.passwordHash) {
      return c.json({ error: "Password not set for this user" }, 400);
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordsMatch) {
      return c.json({ error: "Invalid password" }, 401);
    }

    const token = jwt.sign({ id: user._id ,username:user.username,email:user.email}, process.env.JWT_SECRET, {
      expiresIn: "30h", 
    });

    
    return c.json({
      message: "Signin successful",
      token, 
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};



const forgotPassword= async (c) => {
  try {
    const { email } = await c.req.json();

    const user = await User.findOne({ email });
    if (!user) return c.json({ message: "User not found" }, 404);
	console.log("1")
    // Generate Reset Token (Valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send Reset Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);

    return c.json({ message: "Password reset link sent to email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

const resetPassword= async (c) => {
  try {
    const { token, newPassword } = await c.req.json();

    // Verify Reset Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return c.json({ message: "Invalid or expired token" }, 400);
    }

    const user = await User.findById(decoded.id);
    if (!user) return c.json({ message: "User not found" }, 404);

    // Hash New Password
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return c.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Reset password error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};



const username = async (c) => {
  try {
	
    const { username } = c.req.param(); 

    const user = await User.findOne({ username }).select('-passwordHash'); // Find user by username

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: 'Error fetching user' }, 500);
  }
};


const usernameEdit= async (c) => {
  try {
    const userId = c.get("user").id; // Get user ID from token
   const body = await c.req.json(); // Read request body
  

    const { username } = body;
    
    if (!username || username.length < 3 || username.length > 30) {
      return c.json({ success: false, message: "Username must be between 3 and 30 characters." }, 400);
    }

   
    if (!/^[a-z0-9_.-]+$/.test(username)) {
      return c.json({ success: false, message: "Username can only contain lowercase letters, numbers, underscores, dots, and hyphens." }, 400);
    }

   
    const user = await User.findById(userId);
    if (!user) {
      return c.json({ success: false, message: "User not found." }, 404);
    }

  
    if (user.username === username) {
      return c.json({ success: false, message: "Please enter a different username." }, 400);
    }

   
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return c.json({ success: false, message: "Username is already taken." }, 400);
    }

   
    user.username = username;
    await user.save();

    return c.json({ success: true, message: "Username updated successfully.", username });
  } catch (error) {
    console.error("Error updating username:", error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};


module.exports = { signUp, signIn,username ,forgotPassword,resetPassword,usernameEdit};
