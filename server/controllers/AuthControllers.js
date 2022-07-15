import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import UserModel from "../models/UserModel.js";

// signUp user

export const signUp = async (req, res, next) => {
  const { username } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const oldUser = await User.findOne({ username });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    const user = await newUser.save();
    const toekn = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};


// Login User

export const login = async(req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect) return next(createError(400, "Wrong password or username"));

        // implementing authorization with JWT
        const token = jwt.sign({
            username: user.username,
            id: user._id,
        }, 
        process.env.JWT_KEY,
        {expiresIn: "1h"}
        );

        const {password, isAdmin, ...otherDetails} = user._doc;
        res
            .cookie("access_token", token , {
                httpOnly: true,
            })
            .status(200)
            .json({details: {...otherDetails}, isAdmin, token})
    } catch (error) {
        res.status(500).json(error);
    }
}
