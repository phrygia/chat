import React, { useState } from "react";
import {Dialog, Avatar} from "@material-ui/core";
import firebase from "../../firebase";
import { useSelector } from "react-redux";
import { IoCloseOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import styled from "styled-components";

const Modal = styled(Dialog)`
    [class$="-rounded"] {
        padding: 30px 0 20px;
        min-width: 300px;
        width: 300px;
        height: 440px;
        border-radius: 0;
        overflow: hidden;
    }
    .close_btn {
        position: absolute;
        right: 5px;
        top: 5px;
        svg {
            font-size: 1.3rem;
            color: #959595;
        }
    }
    h1 {
        padding: 0 20px 15px;
        font-weight: 500;
        font-size: 1rem;
        border-bottom: 1px solid #e6e6e6;
    }
    section {
        padding-left: 20px;
        padding-right: 20px;
        .search_form {
            position: relative;
            padding-top: 20px;
            margin-bottom: 20px;
            input {
                width: 100%;
                height: 30px;
                border: 0;
                border-bottom: 1px solid #323232;
                font-size: 0.9rem;
            }
            button {
                position: absolute;
                right: 0;
                top: 24px;
                width: 30px;
                border: 0;
                text-align: right;
                svg {
                    font-size: 1.3rem;
                }
            }
        }
        .search_info {
            color: #999999;
            font-size: 0.8rem;
            line-height: 1.3;
            word-break: keep-all;
        }
        .search_result {
            height: 260px;
            position: relative;
            text-align: center;
            button {
                position: absolute;
                right: 0;
                bottom: 20px;
                padding: 7px 15px;
                border-radius: 4px;
                background-color: #fee500;
                color: #4c4c4c;
            }
            [class$="circle"] {
                display: block;
                margin: 60px auto 10px;
                width: 80px;
                height: 80px;
                border-radius: 30px;
                border: 1px solid #f2f2f2;
            }
            b {
                font-size: 0.9rem;
            }
            p {
                font-size: 0.85rem;
                color: #737373;
            }
        }
        .search_info_result {
            margin-top: 108px;
            line-height: 1.3;
            word-break: keep-all;
            text-align: center;
            b {
                padding: 0 10px;
                font-size: 0.95rem;
                font-weight: 400;
            }
            p {
                margin-top: 8px;
                color: #999999;
                font-size: 0.8rem;
            }
        }
    }
`;

function SearchFriends({  open, close, friendsList }) {
    const [email, setEmail] = useState("");
    const [searchId, setSearchId] = useState();
    const [noFriend, setNoFriend] = useState();
    const [searchText, setSearchText] = useState(
        "회원가입 시 입력한 이메일 ID로 친구를 검색 할 수 있습니다."
    );
    const user = useSelector((state) => state.user.currentUser);
    const usersRef = firebase.database().ref("users");

    const {allFriendsList} = user

    const handleSearch = () => {
        setNoFriend("");
        setSearchId("");
        if (email.length !== 0) {
            setSearchText("");
            const result = allFriendsList.filter((value) => {
                if (value.email === email) {
                    return value;
                }
            });
            if (result.length === 0) {
                setNoFriend(`${email}를 찾을 수 없습니다.`);
            } else {
                const { image, name } = result[0];
                const search_user = (
                    <div className="searh_profile">
                        <Avatar src={image} alt={name} />
                        <b>{name}</b>
                        {result[0].statusMessage ? (
                            <p>{result[0].statusMessage}</p>
                        ) : (
                            ""
                        )}
                    </div>
                );
                setSearchId(search_user);
            }
        }
    };

    const onChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        if (value.length === 0) {
            setNoFriend("");
            setSearchText(
                "회원가입 시 입력한 이메일 ID로 친구를 검색 할 수 있습니다."
            );
            setSearchId();
        }
    };

    const handleAddFriend = async () => {
        try {
            let friend;
            // 유저리스트에서 검색한 친구의 정보를 가져온다.
            allFriendsList.filter((value) => {
                if (value.email === email) {
                    friend = {
                        id: value.id,
                        // name: value.name,
                        // image: value.image,
                        // statusMessage: value.statusMessage
                        //     ? value.statusMessage
                        //     : "",
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                    };
                }
            });
            // 이미 추가된 친구라면
            console.log(friendsList, friend)
            const friendFilter = friendsList.filter((val) => {
                console.log(val.key, friend.id)
                if (val.key === friend.id) return val;
            });
            // console.log(friendFilter)
            if (friendFilter.length > 0) {
                alert("이미 추가된 친구입니다.");
            } else {
                await usersRef.child(`${user.uid}/friends`).update({
                    [friend.id]: friend,
                });
                onClose();
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleSearch();
        }
    };

    const onClose = () => {
        close();
        setTimeout(() => {
            setEmail("");
            setSearchId("");
            setSearchText(
                '"회원가입 시 입력한 이메일 ID로 친구를 검색 할 수 있습니다.'
            );
        }, 500);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <header>
                <button onClick={onClose} className="close_btn">
                    <IoCloseOutline />
                </button>
                <h1>친구 추가</h1>
            </header>
            <section>
                <div className="search_form">
                    <input
                        name="id"
                        type="email"
                        value={email}
                        placeholder="ID를 입력하세요"
                        maxLength="20"
                        onChange={onChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleSearch}>
                        <IoMdSearch />
                    </button>
                </div>
                {searchId && (
                    <div className="search_result">
                        {searchId}
                        <button onClick={handleAddFriend}>친구 추가</button>
                    </div>
                )}
                <p className="search_info">{searchText}</p>
                {noFriend && (
                    <div className="search_info_result">
                        <b>{noFriend}</b>{" "}
                        <p>입력하신 아이디로 등록한 회원이 없습니다.</p>
                    </div>
                )}
            </section>
        </Modal>
    );
}

export default SearchFriends;
