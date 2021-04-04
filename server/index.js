const express = require("express");
const app = express();
const port = 5000;
// const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const config = require("./config/key");

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//applcation/x-www-form/urlencoded의 데이터를 분석해서 가져온다.
app.use(express.urlencoded({ extended: true }));

//application/json의 데이터를 분석해서 가져온다.
app.use(express.json());
app.use(cookieParser());

mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connetced..."))
    .catch((err) => console.log(err));

app.get("/", function (req, res) {
    res.send("hello world");
});

//회원가입
app.post("/api/users/register", (req, res) => {
    //save 하기전에 비밀번호 암호화 -> USer.js파일에서 userSchema.pre로 설정

    //회원가입 할때 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body);

    user.save((err, userinfo) => {
        if (err) {
            console.log(err);
            return res.json({ success: false, err });
        }
        return res.status(200).json({
            success: true,
        });
    });
});

//로그인
app.post("/api/users/login", (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "프리지아톡 계정(이메일)을 다시 확인해 주세요.",
            });
        }

        //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호를 다시 확인해 주세요.",
                });
            }

            //비밀번호까지 맞다면 token을 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //토큰을 저장한다. -> 어디에 ?  쿠기, 로컬스토리지 ..
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

app.get("/api/users/auth", auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true라는 말.
    res.status(200).json({
        _id: req.user.id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        register_date: req.user.register_date,
        image: req.user.image,
    });
});

app.get("/api/users/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user.id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true,
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));

app.post("/api/users/:userName/pwEdit", async (req, res) => {
    console.log(req);
    // try {
    //     const { previousPassword, password, rePassword, userId } = req.body;
    //     const result = await User.findById(userId, "password");

    //     bcrypt.compare(previousPassword, result.password).then((isMatch) => {
    //         if (!isMatch) {
    //             return res.status(400).json({
    //                 match_msg: "기존 비밀번호와 일치하지 않습니다",
    //             });
    //         } else {
    //             if (password === rePassword) {
    //                 bcrypt.genSalt(10, (err, salt) => {
    //                     bcrypt.hash(password, salt, (err, hash) => {
    //                         if (err) throw err;
    //                         result.password = hash;
    //                         result.save();
    //                     });
    //                 });
    //                 res.status(200).json({
    //                     success_msg: "비밀번호 업데이트에 성공했습니다",
    //                 });
    //             } else {
    //                 res.status(400).json({
    //                     fail_msg: "새로운 비밀번호가 일치하지 않습니다",
    //                 });
    //             }
    //         }
    //     });
    // } catch (e) {
    //     // console.log('profile : ', e)
    // }
});
