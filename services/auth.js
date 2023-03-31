const jwt = require("jsonwebtoken")
const userModel = require("./../model/model")
require("dotenv").config()

exports.setUser = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name
    }, process.env.secret)
};

exports.isLogged = async (req, res, next) => {
    try {
        if (!(req.cookies.token)) {
            req.isLogin = false;
            req.user = null;
        } else {
            const token = req.cookies.token;
            const user = jwt.verify(token, process.env.secret);
            const dbuser = await userModel.findById(user._id)
            req.user = dbuser;
            // console.log(req.user);
            req.isLogin = true;
        }
    } catch (error) {
        req.isLogin = false;
        req.user = null;
    }
    next()
}