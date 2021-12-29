import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import { BsPersonPlus } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import firebase from '../../firebase';
import { loadFriendsList } from '../../redux/_actions/user_action';
import SearchFriends from './SearchFriends';
import Search from '../chat/talk/Search';
import defaultIcon from '../../assets/images/default_icon.png';

const Section = styled.section`
  a,
  li {
    width: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
    padding: 10px 25px;
    &:hover {
      background-color: #f2f2f2;
    }
    font-size: 0.8rem;
    strong {
      color: #262626;
      font-size: 14px;
    }
    p {
      margin-top: 6px;
      color: #b9b9b9;
      font-size: 12px;
    }
    [class$='circle'] {
      width: 75px;
      height: 75px;
      margin-right: 15px;
      border-radius: 20px;
      border: 1px solid #f2f2f2;
      background-color: #fff;
    }
  }
  .me {
    &.sch {
      display: none;
    }
    [class$='circle'] {
      width: 54px;
      height: 54px;
    }
    & > a {
      padding: 20px 25px;
    }
    .img_box {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      line-height: 1;
      user-select: none;
      justify-content: center;
      overflow: hidden;
      position: relative;
      width: 75px;
      height: 75px;
      margin-right: 15px;
      border-radius: 20px;
      border: 1px solid rgb(242, 242, 242);
      background-color: #fff;
      img {
        color: transparent;
        width: 100%;
        height: 100%;
        object-fit: cover;
        text-align: center;
        text-indent: 10000px;
      }
    }
  }
  .myFriends {
    & > h3 {
      position: relative;
      padding: 0 25px 10px;
      margin: 10px 0 7px;
      color: #323232;
      font-size: 15px;
      &:before {
        content: '';
        width: 40px;
        height: 2px;
        background-color: #f7be16;
        position: absolute;
        left: 25px;
        bottom: 2px;
      }
      span {
        margin-left: 3px;
      }
    }
  }
`;

const FriendsLists = styled.div`
  /* 스크롤바 설정*/
  &::-webkit-scrollbar {
    width: 6px;
  }

  /* 스크롤바 막대 설정*/
  &::-webkit-scrollbar-thumb {
    height: 17%;
    background-color: #bcbbbb;
    border-radius: 10px;
  }

  /* 스크롤바 뒷 배경 설정*/
  &::-webkit-scrollbar-track {
    background-color: #eee;
  }
  .talk_title {
    button {
      border-radius: 100%;
      position: absolute;
      top: 27px;
      width: 40px;
      height: 40px;
      padding-top: 5px;
      text-align: center;
      background-color: transparent;
      svg {
        color: #353535;
        font-size: 1.5rem;
      }
      &:nth-of-type(1) {
        right: 60px;
      }
      &:nth-of-type(2) {
        right: 20px;
      }
      &:hover {
        background-color: #f2f2f2;
      }
    }
  }
`;

function FriendsList() {
  const [renderList, setRenderList] = useState([]);
  const [myFriendsList, setMyFriendsList] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [search, setSearch] = useState(false);
  const [searchStatus, setSearchStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [showMe, setShowMe] = useState(true);
  const user = useSelector(state => state.user.currentUser);
  const allFriendsList = user?.allFriendsList;
  const usersRef = firebase.database().ref('users');
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (user && allFriendsList) {
      let friendsArr = [];

      usersRef.child(`${user.uid}/friends`).on('child_added', snapshot => {
        friendsArr.push(snapshot.val());
        dispatch(loadFriendsList(friendsArr));

        setRenderList(handleFriendList(friendsArr));
        setFriendsList(handleFriendList(friendsArr));
      });
    }
    return () => {
      usersRef.off();
    };
  }, [allFriendsList, dispatch]);

  const handleremoveFriend = id => {
    if (window.confirm('선택한 친구를 삭제하시겠습니까?')) {
      const filterdList = user.myFriendsList.filter(val => {
        if (id !== val.id) return val;
      });
      // dispatch(loadFriendsList(filterdList));
      // setRenderList(handleFriendList(filterdList));
      // setFriendsList(handleFriendList(filterdList));
      // usersRef.child(`${user.uid}/friends/${id}`).remove();
      console.log(user.myFriendsList, filterdList);
      alert('성공적으로 삭제하였습니다.');
    } else {
      alert('취소합니다.');
    }
  };

  const handleFriendList = friendsArr => {
    let arr = [];
    let uniqueArr = [];

    const result = friendsArr.map((val, index) => {
      // all user 목록에서 이미지 가져오기
      let getInfo = [];
      allFriendsList &&
        allFriendsList.filter(list => {
          if (list.id === val.id) return (getInfo = list);
        });
      arr.push(getInfo);
      arr.forEach(val => {
        if (!uniqueArr.includes(val)) uniqueArr.push(val);
      });
      setMyFriendsList(uniqueArr);
      return (
        <li
          key={val.id + index}
          onDoubleClick={() => changeChatRoom(val, getInfo)}
        >
          <Avatar src={getInfo.image} alt={getInfo.name} />
          <div>
            <strong>{getInfo.name}</strong>
            {getInfo.statusMessage && <p>{getInfo.statusMessage}</p>}
          </div>
          {/* <button onClick={() => handleremoveFriend(val.id)}>삭제</button> */}
        </li>
      );
    });
    return result;
  };

  const changeChatRoom = async (val, info) => {
    const currentUser = user.uid;
    const userId = val.id;

    const chatRoomId =
      userId > currentUser
        ? `${userId}/${currentUser}`
        : `${currentUser}/${userId}`;

    const chatRoomData = {
      id: chatRoomId,
      name: info.name,
      description: chatRoomId,
      createdBy: {
        name: chatRoomId,
      },
    };

    await usersRef
      .child(currentUser)
      .update({ currentChatFriend: chatRoomData });
    history.push(`/chat/${info.name}`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onChange = e => {
    if (e.target.value.length === 0) {
      renderDirectMeesage(renderList, false, e.target.value);
      setShowMe(true);
    } else {
      renderDirectMeesage(myFriendsList, true, e.target.value);
      setShowMe(false);
    }
  };

  const handleSearchList = () => {
    setSearch(!search);
  };

  const handleSearchClose = () => {
    setSearch(!search);
    setSearchStatus(false);
    setFriendsList(renderList);
    setShowMe(true);
  };

  const renderDirectMeesage = (users, isSearch, schWord) => {
    if (users && users.length > 0) {
      // 검색
      if (isSearch) {
        const regex = new RegExp(schWord, 'gi');
        const result = users.map((user, index) => {
          if (user.name && user.name.match(regex)) {
            // console.log(user)
            const finds = allFriendsList.filter(val => {
              if (val.id === user.id) return val;
            });
            return (
              <li
                key={user.id + index}
                onDoubleClick={() => changeChatRoom(user)}
              >
                <Avatar src={finds[0].image} alt={finds[0].name} />
                <div>
                  <strong>{finds[0].name}</strong>
                  {finds[0].statusMessage && <p>{finds[0].statusMessage}</p>}
                </div>
              </li>
            );
          }
        });
        setSearchStatus(true);
        setFriendsList(result);
      } else {
        setSearchStatus(false);
        setFriendsList(renderList);
      }
    }
  };

  return (
    <FriendsLists
      className="talk_box list"
      speed={1.5}
      horizontal={false}
      smoothScrolling={true}
    >
      <header className="talk_title">
        <h1>친구</h1>
        <button onClick={handleSearchList} title="검색">
          <AiOutlineSearch />
        </button>
        <button onClick={handleClickOpen} title="친구추가">
          <BsPersonPlus />
        </button>
      </header>
      {search && (
        <Search
          placeholder="이름으로 검색"
          onChange={onChange}
          onClick={handleSearchClose}
        />
      )}
      <SearchFriends
        open={open}
        close={handleClose}
        friendsList={friendsList}
      />
      <Section>
        <article className={showMe ? 'me' : 'sch me'}>
          <Link to="/edit/profile">
            <div className="img_box">
              <img
                alt={user && user.displayName}
                src={user ? user.photoURL : defaultIcon}
              />
            </div>
            <div>
              <strong>
                {user && user.statusName
                  ? user.statusName
                  : user && user.displayName}
              </strong>
              <p>{user && user.statusMessage}</p>
            </div>
          </Link>
        </article>
        <article className="myFriends">
          {friendsList && (
            <>
              {!searchStatus && (
                <h3>
                  친구 <span>{friendsList.length}</span>
                </h3>
              )}
              <ul>{friendsList}</ul>
            </>
          )}
        </article>
      </Section>
    </FriendsLists>
  );
}

export default FriendsList;
