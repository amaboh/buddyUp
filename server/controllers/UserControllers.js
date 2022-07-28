import User from "../models/User.js";

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(["-password", "-isAdmin"])
    res.json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const getAllUsersInfo = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export const updateUser = async(req, res)=>{
    try {
        const {username, avatar} = req.body;
        await User.findOneAndUpdate({_id: req.user.id},{
            username, avatar
        })

        res.json({msg: "Update Success!"})
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

export const updateUserRole = async (req, res)=>{
    try {
        const {isAdmin} = req.body
        await User.findOneAndUpdate({_id: req.params.id}, {isAdmin})

        res.json({msg: "Update Success"})
    } catch (error) {
        return res.status(500).json({ msg: error.message})
    }
}
