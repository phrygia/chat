import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

function LandingPage(props) {;

    const onClickHandler = () => {
        axios.get(`/api/users/logout`).then((response) => {
            if (response.data.success) {
                props.history.push("/login");
            } else {
                alert("로그아웃에 실패했습니다.");
            }
        });
    };

    return (
        <div>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>logout</button>
        </div>
    );
}

export default withRouter(LandingPage);
