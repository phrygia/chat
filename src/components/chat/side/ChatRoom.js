import React, { useState, useEffect } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core/'
import { useSelector, useDispatch } from 'react-redux'
import firebase from '../../../firebase'
import { setCurrentChatRoom } from '../../../redux/_actions/chat_action'

function ChatRoom() {
  const [show, setShow] = useState(false)
  const [formValue, setFormValue] = useState({
    name: '',
    description: '',
  })
  const [chatRooms, setChatRooms] = useState([])
  const [notifications, setNotifications] = useState([])
  const [chatRoomsArr, setChatRoomsArr] = useState([]) // 이벤트 리스너 끊어주기 위해
  const [selectedRoom, setSelecedtRoom] = useState('')
  const chatRoom = useSelector((state) => state.chat.currentChatRoom)
  const user = useSelector((state) => state.user.currentUser)
  const chatRoomsRef = firebase.database().ref('chatRooms')
  const messagesRef = firebase.database().ref('messages')
  const dispatch = useDispatch()

  const { name, description } = formValue

  useEffect(() => {
    if (chatRooms) loadChatRooms()

    return () => {
      chatRoomsRef.off()
    }
  }, [selectedRoom, notifications])

  const handleClose = () => {
    setShow(false)
  }

  const handleShow = () => {
    setShow(true)
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (name && description) {
      addChatRoom()
    }
  }

  const onchange = (e) => {
    const { name, value } = e.target
    setFormValue({
      ...formValue,
      [name]: value,
    })
  }

  // 방 추가
  const addChatRoom = async () => {
    const key = chatRoomsRef.push().key
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    }
    try {
      await chatRoomsRef.child(key).update(newChatRoom)
      setFormValue({
        name: '',
        description: '',
      })
      setShow(false)
    } catch (error) {
      alert(error)
    }
  }

  // 공개방이 있으면 로딩시 불러오기
  const loadChatRooms = () => {
    let chatRoomsArr = []

    // firebase에서 방이 있다면 chatRoomsArr 배열에 정보 저장
    chatRoomsRef.on('child_added', (snapshot) => {
      chatRoomsArr.push(snapshot.val())
      if (chatRoomsArr.length > 0) {
        // chatRoomsArr만 넣으면 에러가 나서 문자열로 바꿔서 저장
        setChatRooms(JSON.stringify(chatRoomsArr))
        addNotification(snapshot.key)

        setChatRoomsArr(chatRoomsArr)
        // alarmRef.set({
        //   username: user.uid,
        //   content: notifications,
        //   timestamp: firebase.database.ServerValue.TIMESTAMP,
        // })
      }
      //   notifications.filter((val) => {
      //     console.log(val)
      //     console.log(user.uid)
      //     if (val.id === user.uid) {
      //       console.log(val)
      //     }
      //   })

      /*
            // 첫번째 방이 선택되게
              handleChatRoom(chatRoomsArr[0])
            if (firstLoad && chatRoomsArr.length > 0) {
                handleChatRoom(chatRoomsArr[0])
                    setFirstLoad(false)
            } 
            */
    })
  }

  //   // 채팅방 개수
  //   const renderChatRoomsCount = (chatRoomsArr) => {
  //     if (chatRoomsArr && chatRoomsArr.length > 0) {
  //       const chatRoomsCount = JSON.parse(chatRoomsArr)
  //       return chatRoomsCount.length
  //     }
  //   }

  // 채팅방이 1개이상이면 목록에 표시
  const renderChatRooms = (chatRoomsArr) => {
    if (chatRoomsArr && chatRoomsArr.length > 0) {
      // 문자열로 받은걸 객체화
      const chatRooms = JSON.parse(chatRoomsArr)
      return chatRooms.map((room) => (
        <li
          style={{
            cursor: 'pointer',
            backgroundColor: room.id === selectedRoom && '#ffff45',
          }}
          key={room.id}
          onClick={() => saveChatRoomInfo(room)}
        >
          {room.name}
          <span
            style={{
              borderRadius: '3px',
              width: '20px',
              height: '20px',
              backgroundColor: 'red',
              color: '#fff',
            }}
          >
            {/* {setDD(room)} */}
            {getNotificationCount(room)}
          </span>
        </li>
      ))
    }
  }

  // 선택한 방 정보 리덕스 저장
  const saveChatRoomInfo = (room) => {
    dispatch(setCurrentChatRoom(room, false))
    setSelecedtRoom(room.id)
  }

  const clearNotification = () => {
    let index = notifications.findIndex((notification) => notification.id === chatRoom.id)
    if (index !== -1) {
      let updatedNotiociations = [...notifications]
      updatedNotiociations[index].lastKnlastKnownTotal = notifications[index].total
      updatedNotiociations[index].count = 0
      setNotifications(updatedNotiociations)
    }
  }

  // 해당 채팅방의 count를 구하는 중입니다.
  const getNotificationCount = (room) => {
    let count = 0
    notifications.forEach((value) => {
      if (value.id === room.id) {
        count = value.count
      }
    })
    if (count > 0) return count
  }

  const addNotification = (roomId) => {
    messagesRef.child(roomId).on('value', (snapshot) => {
      if (chatRoom) {
        handleNotification(roomId, chatRoom.id, notifications, snapshot)
      }
    })
  }

  const handleNotification = (roomId, currentRoomId, notifications, snapshot) => {
    // 이미 notifications state 안에 알림 정보가 들어있는 채팅방과 그렇지 않을 채팅방을 나눠주기
    let index = notifications.findIndex((notification) => notification.id === roomId)
    let lastTotal = 0

    // notifications state 안에 해당 채팅방의 알림 정보가 없을 때
    if (index === -1) {
      notifications.push({
        id: roomId,
        total: snapshot.numChildren(),
        lastKnownTotal: snapshot.numChildren(),
        count: 0,
      })
    } else {
      // 이미 해당 채팅방의 알림 정보가 있을 때

      // 상대방이 채팅 보내는 그 해당 채팅방에 있지 않을 때
      if (roomId !== currentRoomId) {
        // 현재까지 유저가 확인한 총 메시지 개수
        lastTotal = notifications[index].lastKnownTotal

        // count (알림으로 보여줄 숫자)를 구하기
        // 현재 총 메시지 개수 - 이전에 확인한 총 메시지 개수 > 0
        // 현재 총 메시지 개수가 10개이고 이전에 확인한 메시지가 8개 였다면 2개를 알림으로 보여줘야 함
        if (snapshot.numChildren() - lastTotal > 0) {
          notifications[index].count = snapshot.numChildren() - lastTotal
        }
      }
      // total property에 현재 전체 메시지 개수를 넣어주기
      notifications[index].total = snapshot.numChildren()
    }

    // 목표는 방 하나 하나의 맞는 알림 정보를 notifications state에 넣어주기
    setNotifications(notifications)
  }

  return (
    <div>
      {/* <div>{renderChatRoomsCount(chatRooms)}개</div> */}
      <div>{chatRoomsArr && chatRoomsArr.length}개</div>
      <button onClick={handleShow}>demo modal</button>

      <ul>{renderChatRooms(chatRooms)}</ul>

      <Dialog
        open={show}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">채팅방 만들기</DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmit}>
            이름
            <input name="name" onChange={onchange} /> <br />
            설명
            <input name="description" onChange={onchange} />
          </form>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} color="primary">
            취소
          </button>
          <button onClick={onSubmit} color="primary" autoFocus>
            방 생성
          </button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ChatRoom
