import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase";
import { Avatar } from "@material-ui/core";
import styled from "styled-components";
import Search from "./main/Search";
import { AiOutlineSearch } from "react-icons/ai";

const Chat = styled.div`
  padding-top: 63px;
  .talk_title {
    button {
      border-radius: 100%;
      position: absolute;
      top: 27px;
      right: 20px;
      width: 40px;
      height: 40px;
      padding-top: 5px;
      text-align: center;
      background-color: transparent;
      &:hover {
        background-color: #f2f2f2;
      }
      svg {
        color: #353535;
        font-size: 1.5rem;
      }
    }
  }
`

const Ul = styled.ul`
margin-top: 5px;
  li {
      width: 100%;
      display: flex;
      cursor: pointer;
      align-items: center;
      padding: 7px 20px;
      &:hover {
          background-color: #f2f2f2;
      }
      font-size: 0.7rem;
      strong {
          color: #262626;
          font-weight: 500;
      }
      p {
          color: #737373;
      }
      [class$="circle"] {
          width: 50px;
          height: 50px;
          margin-right: 10px;
          border-radius: 100%;
          border: 1px solid #f2f2f2;
      }
  }
`

function ChatList() {
  const [userRender, setUserRender] = useState();
  const [usersList, setUsersList] = useState();
  const [search, setSearch] = useState(false);
  const [selectedRoom, setSelecedtRoom] = useState("");
  const loginUser = useSelector((state) => state.user.currentUser);
  const allFriendsList = useSelector(
      (state) => state.user.currentUser.allFriendsList
  );
  const usersRef = firebase.database().ref("users");
  const messagesRef = firebase.database().ref("messages");
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
        usersRef.off()
        messagesRef.off()
    }
  }, [allFriendsList]);

  const filterUserName = (obj, key) => {
      // 마지막 텍스트
      let otherTexts = [];
      for (const key in obj) {
        otherTexts.push(obj[key])
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
                              <div>
                                <strong>{user.user.name}</strong>
                                <p>{user.content}</p>
                              </div>
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
                          <div>
                            <strong>{user.user.name}</strong>
                            <p>{user.content}</p>
                          </div>
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

      await usersRef
          .child(currentUser)
          .update({ currentChatFriend: chatRoomData });

      setSelecedtRoom(userId);
      history.push(`/chat/${user.name}`);
  };

  const onChange = (e) => {
      renderDirectMeesage(usersList, true, e.target.value);
  };

  const onClick = () => {
    setSearch(!search)
  }

  const handleSearchClose = () => {
    setSearch(!search)
    renderDirectMeesage(usersList, false);
  }

  return (
      <Chat>
          <header className="talk_title">
            <h1>채팅</h1>
            <button onClick={onClick} title="검색">
                <AiOutlineSearch />
              </button>
          </header>
          {search && <Search placeholder="참여자 이름" onChange={onChange} onClick={handleSearchClose} />}
          <Ul>{userRender && userRender}</Ul>
      </Chat>
  );
}

export default ChatList;
