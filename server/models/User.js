const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        //토큰 유효기간
        type: Number,
    },
    register_date: {
        type: Date,
        default: Date.now,
    },
});

//user 정보를 저장하게 전에 실행
userSchema.pre("save", function (next) {
    var user = this; //상단의 스키마 정보
    /*
    1. salt를 생성
    2. salt를 이용해서 비밀번호를 암호화 시킨다 
  */
    if (user.isModified("password")) {
        //비밀번호를 바꿀때만 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next(); //app.post('/register', ... 소스로 넘김
            });
        });
    } else {
        next();
    }
});

//비밀번호 비교
userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
    //
};

//토큰 생성을 위해서 jsonwebtoken 라이브러리 이용
userSchema.methods.generateToken = function (cb) {
    var user = this;

    //jsonwebtoken 웹 토큰 생성
    var token = jwt.sign(user._id.toHexString(), "secretToken");
    // user._id + 'secretToken' = token;
    // ->
    // 'secretToken' -> user._id

    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
};

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    //토큰을 decode 한다
    jwt.verify(token, "secretToken", function (err, decoded) {
        //유저 아이디를 이용해서 유저를 찾을 다음에 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({ _id: decoded, token: token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        });
    });
};

//스키마를 모델로 감싸줌
const User = mongoose.model("User", userSchema);
module.exports = { User };
