import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { editPassword } from "../../redux/_actions/user_action";
import { withRouter } from "react-router-dom";

function EditPassword(props) {
    const user = useSelector((state) => state.user);
    console.log(user);

    const { userName } = useParams();
    const [form, setValues] = useState({
        previousPassword: "",
        password: "",
        rePassword: "",
    });
    const dispatch = useDispatch();
    const onChange = (e) => {
        setValues({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = async (e) => {
        await e.preventDefault();
        const { previousPassword, password, rePassword } = form;
        const token = localStorage.getItem("token");

        let body = {
            password: password,
            rePassword: rePassword,
            // userId: userId,
            // userName: userName,
        };

        dispatch(editPassword(body)).then((response) => {
            console.log(body);
            if (response.payload.loginSuccess) {
                props.history.push("/");
            } else {
                return alert("에러가 발생했습니다");
            }
        });
    };

    return (
        <div>
            {/* <Helmet title={`Profile | ${userName}님의 프로필`} /> */}
            <div>
                <div>
                    <div>
                        <strong>Edit Password</strong>
                    </div>
                    <div>
                        <form onSubmit={onSubmit}>
                            <div>
                                <label htmlFor="title">기존 비밀번호</label>
                                <input
                                    type="password"
                                    name="previousPassword"
                                    id="previousPassword"
                                    className="form-control mb-2"
                                    onChange={onChange}
                                />
                                {/* {previousMatchMsg ? (
                                    <Alert severity="error">
                                        {previousMatchMsg}
                                    </Alert>
                                ) : (
                                    ""
                                )} */}
                            </div>
                            <div>
                                <label htmlFor="title">새로운 비밀번호</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="form-control"
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="title">비밀번호 확인</label>
                                <input
                                    type="password"
                                    name="rePassword"
                                    id="rePassword"
                                    className="form-control mb-2"
                                    onChange={onChange}
                                />
                                {/* {errorMsg ? (
                                    <Alert severity="error">{errorMsg}</Alert>
                                ) : (
                                    ""
                                )} */}
                            </div>
                            <button
                                color="success"
                                className="mt-4 mb-4 col-md-3 offset-9"
                            >
                                제출하기
                            </button>
                            {/* {successMsg ? (
                                <Alert severity="success">{successMsg}</Alert>
                            ) : (
                                "" */}
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditPassword;
