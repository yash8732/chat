const { getChat, signUp, handleSignUp, getUsers, chatBegin } = require("../controller/controller");
const {isLogged} = require("./../services/auth")
const router = require("express").Router();

router.use(isLogged)

router
// .route("/chat")
.get("/chat/:id",getChat)

router
.route("/signup")
.get(signUp)
.post(handleSignUp)

router
.route("/users")
.get(getUsers)
.post(chatBegin)

module.exports = router

