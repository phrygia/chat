import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editPassword } from "../../redux/_actions/user_action";
import { withRouter } from "react-router-dom";

function EditPassword(props) {
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

        dispatch(editPassword(body)).then((response) => {
            if (response.payload.loginSuccess) {
                props.history.push("/");
            } else {
                return alert("에러가 발생했습니다");
            }
        });
    };
    return (
        <form onSubmit={onSubmit}>
            <input
                className="email"
                name="email"
                type="text"
                placeholder="프리지아톡 계정(이메일)"
                onChange={onChange}
            />
            <input
                className="password"
                name="password"
                type="password"
                placeholder="비밀번호"
                onChange={onChange}
            />
            <button>ResetPassword</button>
        </form>
    );
}

export default withRouter(EditPassword);
