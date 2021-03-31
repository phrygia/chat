// import Axios from 'axios'
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../redux/_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
    //null => 아무나 출입이 가능한 페이지1
    //true => 로그인한 유저만 출입이 가능한 페이지
    //false => 로그인한 유저는 출입 불가능한 페이지

    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {
            //서버에 request를 보냄
            dispatch(auth()).then((response) => {
                //비로그인 상태
                if (!response.payload.isAuth) {
                    if (option) {
                        props.history.push("/login");
                    }
                } else {
                    //로그인 상태
                    if (adminRoute && response.payload.isAdmin) {
                        //로그인했지만 admin아닐때
                        props.history.push("/");
                    } else {
                        //로그인한 유저가 출입 불가능한 페이지
                        if (option === false) {
                            props.history.push("/");
                        }
                    }
                }
            });
            // axios.get(`/api/users/auth`)
        }, []);
        return <SpecificComponent />;
    }

    return AuthenticationCheck;
}
