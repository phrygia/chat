import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import firebase from "../../../firebase";
import { setCurrentChatRoom } from "../../../redux/_actions/chat_action";
import { Avatar } from "@material-ui/core";
import Search from "../main/Search";

function DirectMessage() {
    const [userRender, setUserRender] = useState();
    const [usersList, setUsersList] = useState();
    const [selectedRoom, setSelecedtRoom] = useState("");
    const loginUser = useSelector((state) => state.user.currentUser);
    const allFriendsList = useSelector(
        (state) => state.user.currentUser.allFriendsList
    );
    const usersRef = firebase.database().ref("users");
    const messagesRef = firebase.database().ref("messages");
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (loginUser && allFriendsList) {
            let roomArr = [];
            messagesRef.on("child_added", (snapshot) => {
                let arr = snapshot.val();
                arr["id"] = snapshot.key;
                roomArr.push(arr);

                // 메시지의 User들 가져오기
                let userArr = [];
                roomArr.map((val) => {
                    for (const key in val) {
                        // id에 설정된 값이 내 id와 같다면 해달 객체 가져오기
                        if (val[key] === loginUser.uid) {
                            for (const keys in val) {
                                if (keys !== "id") {
                                    const info = filterUserName(
                                        val[keys],
                                        keys
                                    );
                                    userArr.push(info);
                                }
                            }
                        } else {
                            if (key === loginUser.uid) {
                                // 마지막 텍스트
                                const info = filterUserName(val[key], val.id);
                                userArr.push(info);
                            }
                        }
                    }
                    renderDirectMeesage(userArr, false);
                    setUsersList(userArr);
                });
            });
        }
        return () => {
            usersRef.off();
            messagesRef.off();
        };
    }, [allFriendsList]);

    const filterUserName = (obj, key) => {
        // 상대방의 마지막 텍스트
        let otherTexts = [];
        for (const key in obj) {
            if(obj[key].user.id !== loginUser.uid) {
                otherTexts.push(obj[key])
            }
        }

        const lastObj = otherTexts[otherTexts.length - 1];

        if(lastObj) {
            const info = {
                id: key,
                name: lastObj.user.name,
                content: lastObj.content,
            };
            return info;
        }

    };

    const renderDirectMeesage = (users, isSearch, schWord) => {
        if (users && users.length > 0) {
            // 전체 친구 목록에서 친구 정보 가져오고 마지막 텍스트 가져오기
            let filterArr = [];
            allFriendsList.filter((val) => {
                for (let i = 0; i < users.length; i++) {
                    if (users[i] && users[i].id === val.id) {
                        let info = {
                            content: users[i].content,
                            user: val,
                        };
                        filterArr.push(info);
                    }
                }
            });

            // 검색
            if (isSearch) {
                const regex = new RegExp(schWord, "gi");
                const result = filterArr.map((user) => {
                    if (user.user.name && user.user.name.match(regex)) {
                        return (
                            <li
                                key={user.user.id}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor:
                                        user.user.id === selectedRoom &&
                                        "#ffff45",
                                }}
                                onDoubleClick={() => changeChatRoom(user.user)}
                            >
                                <Avatar
                                    src={user.user.image}
                                    alt={user.user.name}
                                />
                                {user.user.name}
                                <p>{user.content}</p>
                            </li>
                        );
                    }
                });
                setUserRender(result);
            } else {
                // 모든 user
                // 채팅 목록에 user 뿌리기
                const result = filterArr.map((user) => {
                    return (
                        <li
                            key={user.user.id}
                            style={{
                                cursor: "pointer",
                                backgroundColor:
                                    user.user.id === selectedRoom && "#ffff45",
                            }}
                            onDoubleClick={() => changeChatRoom(user.user)}
                        >
                            <Avatar
                                src={user.user.image}
                                alt={user.user.name}
                            />
                            {user.user.name}
                            <p>{user.content}</p>
                        </li>
                    );
                });
                setUserRender(result);
            }
        }
    };

    const changeChatRoom = async (user) => {
        const currentUser = loginUser.uid;
        const userId = user.id;

        const chatRoomId =
            userId > currentUser
                ? `${userId}/${currentUser}`
                : `${currentUser}/${userId}`;

        const chatRoomData = {
            id: chatRoomId,
            name: user.name,
            description: chatRoomId,
            createdBy: {
                name: chatRoomId,
            },
        };

        dispatch(setCurrentChatRoom(chatRoomData, true));

        await usersRef
            .child(currentUser)
            .update({ currentChatFriend: chatRoomData });

        setSelecedtRoom(userId);
        history.push(`/chat/${user.name}`);
    };

    const onChange = (e) => {
        const RegExp = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}]/gi;
        if (RegExp.test(e.target.value)) {
            alert("특수문자는 입력하실 수 없습니다.");
            e.target.value = e.target.value.substring(0, e.target.value.length - 1);//특수문자를 지우는 구문
        }
        renderDirectMeesage(usersList, true, e.target.value);
    };

    return (
        <div style={{ padding: "80px 20px" }}>
            <Search placeholder="참여자 이름" onChange={onChange} />
            <ul>{userRender && userRender}</ul>
        </div>
    );
}

export default DirectMessage;
