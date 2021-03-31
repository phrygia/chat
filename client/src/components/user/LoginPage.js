import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/_actions/user_action";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import icon from "../../assets/image/talk_icon.png";

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
                    }
                    &::placeholder {
                        color: #ccc;
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
    }
`;

function LoginPage(props) {
    const loginBtn = useRef();
    const dispatch = useDispatch();

    const [values, setValues] = useState({
        email: "",
        password: "",
    });

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
            if (response.payload.loginSuccess) {
                props.history.push("/");
            } else {
                return alert("에러가 발생했습니다");
            }
        });
    };

    const onKeyUp = (e) => {
        // 로그인 조건: 이메일 10자리 이상 && 비밀번호 8자리 이상
        if (email.length > 10 && password.length >= 7) {
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
                <div className="input_box">
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
                        minLength="8"
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
            </section>
        </Form>
    );
}

export default withRouter(LoginPage);
