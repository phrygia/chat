import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/_actions/user_action";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";
import icon from "../../assets/images/talk_icon.png";

const Form = styled.form`
    position: absolute;
    left: 0;
    top: 110px;
    width: 100%;
    text-align: center;
    header {
        img {
            width: 150px;
        }
    }
    section {
        & > div {
            &.input_box {
                width: 300px;
                margin: 35px auto 10px;
                border: 1px solid #ecd72a;
                border-radius: 5px;
                overflow: hidden;
                input {
                    height: 45px;
                    width: 100%;
                    padding: 0 15px;
                    background-color: #fff;
                    border: 0;
                    font-size: 0.9rem;
                    &.password {
                        border-top: 1px solid #f3f3f3;
                        font-weight: 900;
                        letter-spacing: 1.5px;
                        &::placeholder {
                            font-weight: 400;
                            letter-spacing: 0;
                        }
                    }
                    &::placeholder {
                        color: #ccc;
                    }
                }
                &.error {
                    border-color: #e65f3e;
                    border-width: 2px;
                    & + div {
                        margin-top: -2px;
                    }
                }
            }
            button {
                width: 300px;
                height: 50px;
                border: 1px solid #ecd72a;
                border-radius: 5px;
                color: #b1b1b1;
                background-color: #f7f6f6;
                font-size: 0.9rem;
                &.on {
                    background-color: #403631;
                    color: #fff;
                }
            }
        }
        .info_error {
            text-align: left;
            width: 300px;
            margin: 20px auto 0;
            font-size: 0.78rem;
        }
    }
`;

const Ul = styled.ul`
    position: absolute;
    left: 0;
    bottom: -165px;
    width: 100%;
    a {
        color: #a3951f;
        font-size: 0.9rem;
    }
`;

function LoginPage(props) {
    const inputBox = useRef();
    const loginBtn = useRef();
    const dispatch = useDispatch();

    const [values, setValues] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const { email, password } = values;

    const onChange = (e) => {
        const { name, value } = e.target;

        setValues({
            ...values,
            [name]: value,
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        let body = {
            email: email,
            password: password,
        };

        dispatch(loginUser(body)).then((response) => {
            // console.log(response.payload.message);
            if (response.payload.loginSuccess) {
                props.history.push("/");
            } else {
                inputBox.current.classList.add("error");
                setError(response.payload.message);
            }
        });
    };

    const onKeyUp = (e) => {
        // 로그인 조건: 이메일 10자리 이상 && 비밀번호 8자리 이상
        if (email.length > 10 && password.length >= 8) {
            loginBtn.current.classList.add("on"); // 입력 조건 만족하면 버튼이 활성화 표시
            loginBtn.current.disabled = false; // 입력 조건 만족하면 disabled 풀림
        } else {
            loginBtn.current.classList.remove("on");
            loginBtn.current.disabled = false;
        }
    };

    return (
        <Form onSubmit={onSubmit}>
            <header>
                <img src={icon} alt="프리지아톡 로고" />
            </header>
            <section>
                <div ref={inputBox} className="input_box">
                    <input
                        className="email"
                        name="email"
                        type="email"
                        value={email}
                        placeholder="프리지아톡 계정(이메일)"
                        onKeyUp={onKeyUp}
                        onChange={onChange}
                    />
                    <input
                        className="password"
                        name="password"
                        type="password"
                        value={password}
                        // minLength="8"
                        maxLength="20"
                        placeholder="비밀번호"
                        onKeyUp={onKeyUp}
                        onChange={onChange}
                    />
                </div>
                <div>
                    <button ref={loginBtn} disabled>
                        로그인
                    </button>
                </div>
                <div className="info_error">
                    <p>{error}</p>
                </div>
            </section>
            <Ul>
                <li>
                    <Link to="/register">회원가입</Link>
                </li>
                {/* <li>
                    <Link to="/">비밀번호 재설정</Link>
                </li> */}
            </Ul>
        </Form>
    );
}

export default withRouter(LoginPage);
