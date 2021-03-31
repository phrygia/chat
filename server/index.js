const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const config = require("./config/key");

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//applcation/x-www-form/urlencoded의 데이터를 분석해서 가져온다.
app.use(bodyParser.urlencoded({ extended: true }));

//application/json의 데이터를 분석해서 가져온다.
app.use(bodyParser.json());
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

app.get("/api/hello", function (req, res) {
    res.send("안녕하세요");
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
                message: "제공된 이메일에 해당하는 유저가 없습니다.",
            });
        }

        //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다.",
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
        lastname: req.user.lastname,
        role: req.user.role,
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

app.post("/api/users/edit_password", auth, async (req, res) => {
    // const { previousPassword, password, rePassword, userId } = req.body;
    console.log(req);
});

/*
npm init
npm install express --save
npm install mongoose --save
npm install body-parser --save
npm install bcrypt --save
npm install jsonwebtoken --save
npm install cookie-parser --save

model : 스키마를 감싸주는 역할
bcrypt: 비밀번호 암호화
*/

/*
git 설치

git init : git 저장소를 만들어 주는 역할
git status : git 상태 
    1. working directory : 아무것도 하지 않음 처음상태, 
    2. Stagin Area
    3. Git repository (local)
    4. Git repository (remote)
git add .
git commit -m "메시지" : 저장소에 올리기
git push origin master

.gitignore 파일을 만듬 : node_modules 폴더를 빼기 위해
git rm --cached : 모든 정보 삭제 (git rm --cached node_modules -r)

*/

/*
로그인 라우터 만들기

1. 데이터 베이스에서 요청한 e-mail찾기
2. 데이터 베이스에서 요청한 e-mail이 있다면 비밀번호가 같은지 확인
3. 비밀번호까지 같다면 token을 생성


로그인 인증

1. 쿠키에 저장된 토큰을 서버에서 가져와서 복호화를 한다.
2. 복호화를 하면 user id가 나오는데 이를 이용해서 db user Collection에서 유저를 찾은 후 쿠키에서 받아온 토큰이 유저도 갖고있는지 확인


로그아웃 기능
1. 로그아웃 하려는 유저를 db에서 찾는다.
2. 그 유저의 토큰을 지워준다.

*/
