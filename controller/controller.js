const { setUser } = require("../services/auth")
const user = require("./../model/model")
const roomModel = require("./../model/rooms")


exports.getChat = async (req, res) => {
    if (!(req.isLogin)) return res.redirect('/signup');
    res.render("chat", { error: null, user: req.user, roomId: req.params.id })
}

exports.getUsers = async (req, res) => {
    if (!(req.isLogin)) return res.redirect('/signup');
    // console.log(req.user);
    const details = await user.find({ _id: { $ne: req.user._id } });
    // console.log(details);
    req.users = details;
    const currentUser = await user.findOne({ _id: req.user._id })
    let roomId = null;
    let countUnseen = null;
    let unseen = new Map;
    for (const user of details) {
        for (const room of currentUser.rooms) {
            if (user.rooms.includes(room)) {
                roomId = room;
                console.log(roomId);
                // console.log("one by one");
                const findRoom = await roomModel.findById(roomId)
                countUnseen = findRoom.messages.reduce((acc, msg) => {
                    console.log(msg.seen);
                    if (!(msg.userName == req.user.name)){
                        if (msg.seen == false) return acc + 1;
                        else return acc = 0;
                    }
                    else return acc = 0;
                }, 0)
                    ;
                unseen.set(user._id, countUnseen)
            }
        }
    }

    console.log(unseen);
    res.render("users", { users: req.users, user: req.user, unseen: unseen })
}

exports.signUp = async (req, res) => {
    if (req.isLogin) return res.redirect('/users');
    res.render('register', { error: null })
}

exports.handleSignUp = async (req, res) => {
    try {
        const userName = await user.findOne({ name: req.body.name })
        if (userName) {
            const finded = await user.findOne({ name: userName.name })
            // console.log(finded);
            const token = setUser(finded)
            res.cookie('token', token)
            return res.redirect("/users")
        }
        await user.create(req.body)
        // const { name } = req.body
        const finded = await user.findOne(req.body.name)

        const token = setUser(finded)
        res.cookie('token', token)
        return res.redirect("/users");
    } catch (e) {
        console.log(e);
        res.redirect("/signup")
    }
}

exports.chatBegin = async (req, res) => {

    const currentUser = await user.findOne({ _id: req.user._id })
    // console.log("a:",currentUser);
    const chatWith = await user.findOne({ _id: req.body.id })
    // console.log("currentUser:",chatWith);
    let permission = false;
    let roomId = null;
    currentUser.rooms.forEach(room => {
        if (chatWith.rooms.includes(room)) {
            roomId = room;
            permission = true;
        }
    })
    if (!permission) {
        const room = await roomModel.create({ users: [chatWith, currentUser] });
        console.log("room:", room);
        roomId = room._id
        currentUser.rooms.push(room);
        await currentUser.save()
        chatWith.rooms.push(room._id);
        await chatWith.save()
    }
    // const room = await roomModel.find({_id : roomId})
    // console.log(room);
    res.json({ status: "success", roomId })
}