import React, { useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Avatar } from '@material-ui/core'
import { BsPersonPlus } from 'react-icons/bs'
import { AiOutlineSearch } from 'react-icons/ai'
import firebase from '../../firebase'
import { loadFriendsList } from '../../redux/_actions/user_action'
import { setCurrentChatRoom } from '../../redux/_actions/chat_action'
import SearchFriends from './SearchFriends'
import Search from '../chat/main/Search'

const Section = styled.section`
  a,
  li {
    width: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
    padding: 5px 20px;
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
    [class$='circle'] {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 50%;
      border: 1px solid #f2f2f2;
    }
  }
  .me {
    [class$='circle'] {
      width: 54px;
      height: 54px;
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
      width: 54px;
      height: 54px;
      margin-right: 10px;
      border-radius: 50%;
      border: 1px solid rgb(242, 242, 242);
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
    padding-top: 5px;
    border-top: 1px solid #f2f2f2;
    & > h3 {
      padding: 0 20px;
      margin: 7px 0;
      color: #7f7f7f;
      font-size: 0.8rem;
      font-weight: 500;
      span {
        margin-left: 3px;
      }
    }
  }
`

const FriendsLists = styled.div`
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
`

function FriendsList() {
  const [renderList, setRenderList] = useState([])
  const [myFriendsList, setMyFriendsList] = useState([])
  const [friendsList, setFriendsList] = useState([])
  const [search, setSearch] = useState(false)
  const [searchStatus, setSearchStatus] = useState(false)
  const [open, setOpen] = useState(false)
  const user = useSelector((state) => state.user.currentUser)
  const { allFriendsList } = user ? user : []
  const usersRef = firebase.database().ref('users')
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (user && allFriendsList) {
      let friendsArr = []
      let arr = []
      let uniqueArr = []
      usersRef.child(`${user.uid}/friends`).on('child_added', (snapshot) => {
        friendsArr.push(snapshot.val())
        dispatch(loadFriendsList(friendsArr))
        const result = friendsArr.map((val, index) => {
          // all user 목록에서 이미지 가져오기
          let getInfo = []
          allFriendsList.length > 0 && allFriendsList.filter((list) => {
            if (list.id === val.id) return (getInfo = list)
          })
          arr.push(getInfo)
          arr.forEach((val) => {
            if (!uniqueArr.includes(val)) uniqueArr.push(val)
          })
          setMyFriendsList(uniqueArr)
          return (
            <li key={val.id + index} onDoubleClick={() => changeChatRoom(val, getInfo)}>
              <Avatar src={getInfo.image} alt={getInfo.name} />
              <div>
                <strong>{getInfo.name}</strong>
                {getInfo.statusMessage && <p>{getInfo.statusMessage}</p>}
              </div>
            </li>
          )
        })
        setRenderList(result)
        setFriendsList(result)
      })
    }
    return () => {
      if (user) usersRef.off()
    }
  }, [allFriendsList])

  const changeChatRoom = async (val, info) => {
    const currentUser = user.uid
    const userId = val.id

    const chatRoomId = userId > currentUser ? `${userId}/${currentUser}` : `${currentUser}/${userId}`

    const chatRoomData = {
      id: chatRoomId,
      name: info.name,
      description: chatRoomId,
      createdBy: {
        name: chatRoomId,
      },
    }

    dispatch(setCurrentChatRoom(chatRoomData, true))

    await usersRef.child(currentUser).update({ currentChatFriend: chatRoomData })
    history.push(`/chat/${info.name}`)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const onChange = (e) => {
    if (e.target.value.length === 0) {
      renderDirectMeesage(renderList, false, e.target.value)
    } else {
      renderDirectMeesage(myFriendsList, true, e.target.value)
    }
  }

  const handleSearchList = () => {
    setSearch(!search)
  }

  const handleSearchClose = () => {
    setSearch(!search)
    setSearchStatus(false)
    setFriendsList(renderList)
  }

  const renderDirectMeesage = (users, isSearch, schWord) => {
    if (users && users.length > 0) {
      // 검색
      if (isSearch) {
        const regex = new RegExp(schWord, 'gi')
        const result = users.map((user, index) => {
          if (user.name && user.name.match(regex)) {
            // console.log(user)
            const finds = allFriendsList.filter((val) => {
              if (val.id === user.id) return val
            })
            return (
              <li key={user.id + index} onDoubleClick={() => changeChatRoom(user)}>
                <Avatar src={finds[0].image} alt={finds[0].name} />
                <div>
                  <strong>{finds[0].name}</strong>
                  {finds[0].statusMessage && <p>{finds[0].statusMessage}</p>}
                </div>
              </li>
            )
          }
        })
        setSearchStatus(true)
        setFriendsList(result)
      } else {
        setSearchStatus(false)
        setFriendsList(renderList)
      }
    }
  }

  return (
    <FriendsLists className="talk_box list" speed={1.5} horizontal={false} smoothScrolling={true}>
      <header className="talk_title">
        <h1>친구</h1>
        <button onClick={handleSearchList} title="검색">
          <AiOutlineSearch />
        </button>
        <button onClick={handleClickOpen} title="친구추가">
          <BsPersonPlus />
        </button>
      </header>
      {search && <Search placeholder="이름으로 검색" onChange={onChange} onClick={handleSearchClose} />}
      <SearchFriends open={open} close={handleClose} friendsList={friendsList} />
      <Section>
        <article className="me">
          <Link to="/edit/profile">
            <div className="img_box">
              <img alt={user && user.displayName} src={user ? user.photoURL : 'https://raw.githubusercontent.com/phrygia/chat/master/client/src/assets/images/default_icon.png'} />
            </div>
            <div>
              <strong>{user && user.statusName ? user.statusName : user && user.displayName}</strong>
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
  )
}

export default FriendsList
