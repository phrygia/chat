import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
};

function LandingPage(props) {
    const user = useSelector((state) => state.user.userData);

    console.log(user);

    const onClickHandler = () => {
        axios.get(`/api/users/logout`).then((response) => {
            if (response.data.success) {
                props.history.push("/login");
            } else {
                alert("Failed to logout");
            }
        });
    };
    return (
        <div style={style} className={``}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>logout</button>
        </div>
    );
}

export default withRouter(LandingPage);
