// @ts-nocheck
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/_actions/user_action";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import close from "../../assets/image/close.png";

const Form = styled.form`
    h1 {
        margin: 50px 0 40px;
        text-align: center;
        font-size: 1.6rem;
        font-weight: 500;
    }
    .input_box {
        li {
            width: 355px;
            margin: 10px auto 15px;
            label {
                display: block;
                margin-bottom: 8px;
                font-size: 0.875rem;
                font-weight: 500;
            }
            & > div {
                position: relative;
                &:after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    height: 2px;
                    width: 0;
                    background-color: #403631;
                    transition: width 120ms cubic-bezier(0, 0, 0.2, 1);
                }
                &.focus {
                    &:after {
                        width: 100%;
                    }
                }
                input {
                    height: 44px;
                    width: 100%;
                    padding: 0 40px 0 15px;
                    border: 0;
                    border-bottom: 2px solid #ecd72a;
                    &[name="confirm_password"] {
                        margin-top: 10px;
                    }
                    &::placeholder {
                        color: #ccc;
                    }
                }
                .btn_del {
                    position: absolute;
                    right: 15px;
                    bottom: 14px;
                    z-index: 2;
                    display: none;
                    border: 0;
                    border-radius: 17px;
                    width: 17px;
                    height: 17px;
                    color: #fff;
                    background: #b1b1b1 url(${close}) center center / 70% 70%
                        no-repeat;
                }
            }
            .btn_submit {
                width: 100%;
                height: 50px;
                margin: 10px 0 35px;
                text-align: center;
                border: 1px solid #ecd72a;
                border-radius: 5px;
                color: #b1b1b1;
                background-color: #f7f6f6;
                font-size: 0.9rem;
                &.enable {
                    background-color: #403631;
                    color: #fff;
                }
            }
            a {
                display: block;
                padding-top: 30px;
                border-top: 1px solid #c0ae1b;
                text-align: center;
                color: #a3951f;
                font-size: 0.9rem;
            }
        }
    }
`;

function RegisterPage(props) {
    const [values, setValues] = useState({
        email: "",
        name: "",
        password: "",
        confirm_password: "",
    });
    const [errorMsg, setErrorMsg] = useState({
        target_name: "",
        message: "",
    });
    const inputBox = useRef();
    const btnSubmit = useRef();
    const dispatch = useDispatch();

    const { email, name, password, confirm_password } = values;
    const { target_name, message } = errorMsg;

    const onChange = (e) => {
        const { name, value } = e.target;

        setValues({
            ...values,
            [name]: value,
        });

        // input의 길이가 0이싱이면 삭제버튼이 나타나고 focus 효과
        if (value.length > 0) {
            e.target.parentNode.classList.add("focus");
            e.target.nextSibling.style.display = "block";
        } else {
            e.target.parentNode.classList.remove("focus");
            e.target.nextSibling.style.display = "none";
        }

        // 가입완료 버튼 활성화
        if (
            email.length > 10 &&
            password.length > 7 &&
            confirm_password.length > 7 &&
            values.name.length > 3
        ) {
            btnSubmit.current.classList.add("enable");
            btnSubmit.current.disabled = false;
        } else {
            btnSubmit.current.classList.remove("enable");
            btnSubmit.current.disabled = true;
        }
    };

    const inputReset = (e) => {
        e.preventDefault();

        // 클릭되면 버튼 사라짐, focus ui 효과 사라짐
        e.target.style.display = "none";
        e.target.parentNode.classList.remove("focus");

        // 클릭되면 가입완료 버튼 disable 처리됨
        btnSubmit.current.classList.remove("enable");
        btnSubmit.current.disabled = true;

        // 삭제 버튼의 앞에 위치한 input에 접근해서 value를 초기화
        const { name } = e.target.previousSibling;

        setValues({
            ...values,
            [name]: "",
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const chk_name = /([^가-힣\x20a-zA-Z])/i;

        if (chk_name.test(name)) {
            return setErrorMsg({
                ...errorMsg,
                target_name: "name",
                message: "닉네임은 한글과 영문만 입력 가능합니다.",
            });
        }
        if (password.search(/\s/) !== -1) {
            return setErrorMsg({
                ...errorMsg,
                target_name: "password",
                message: "비밀번호에 공백을 입력하실 수 없습니다.",
            });
        }
        if (password !== confirm_password) {
            return setErrorMsg({
                ...errorMsg,
                target_name: "confirm_password",
                message:
                    "입력한 비밀번호와 재입력한 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.",
            });
        }

        let body = {
            email: email,
            name: name,
            password: password,
        };
        console.log(body);
        dispatch(registerUser(body)).then((response) => {
            if (response.payload.success) {
                props.history.push("/login");
            } else {
                return setErrorMsg({
                    ...errorMsg,
                    target_name: "register_fail",
                    message:
                        "회원가입에 실패하였습니다.",
                });
            }
        });
    };

    return (
        <Form onSubmit={onSubmit}>
            <h1>프리지아톡 정보를 입력해 주세요.</h1>
            <section>
                <ul className="input_box ph_text_field" ref={inputBox}>
                    <li>
                        <label>계정 이메일</label>
                        <div>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                placeholder="이메일 입력"
                                onChange={onChange}
                            />
                            <button className="btn_del" onClick={inputReset} />
                        </div>
                    </li>
                    <li>
                        <label>비밀번호</label>
                        <div>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                minLength="8"
                                maxLength="20"
                                placeholder="비밀번호(8~20자리)"
                                onChange={onChange}
                            />
                            <button className="btn_del" onClick={inputReset} />
                        </div>
                        {target_name === "password" && (
                            <p className="info_error">{message}</p>
                        )}
                        <div>
                            <input
                                name="confirm_password"
                                type="password"
                                value={confirm_password}
                                minLength="8"
                                maxLength="20"
                                placeholder="비밀번호 재입력"
                                onChange={onChange}
                            />
                            <button className="btn_del" onClick={inputReset} />
                        </div>
                        {target_name === "confirm_password" && (
                            <p className="info_error">{message}</p>
                        )}
                    </li>
                    <li>
                        <label>닉네임</label>
                        <div>
                            <input
                                name="name"
                                type="text"
                                value={name}
                                maxLength="20"
                                placeholder="닉네임을 입력해 주세요."
                                onChange={onChange}
                            />
                            <button className="btn_del" onClick={inputReset} />
                        </div>
                        {target_name === "name" && (
                            <p className="info_error">{message}</p>
                        )}
                    </li>
                    <li>
                        <button ref={btnSubmit} className="btn_submit" disabled>
                            가입 완료
                        </button>
                        <Link to="/login">처음으로 돌아가기 </Link>
                        {target_name === "register_fail" && (
                            <p className="info_error">{message}</p>
                        )}
                    </li>
                </ul>
            </section>
        </Form>
    );
}

export default withRouter(RegisterPage);
