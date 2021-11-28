import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import firebase from '../../../firebase'
import { setCurrentChatRoom } from '../../../redux/_actions/chat_action'
import { useDispatch } from 'react-redux'

function Favorite() {
  const [favoritedChatRooms, setFavoritedChatRooms] = useState([])
  // const [activeChatRoomId, setActiveChatRoomId] = useState('')
  const [selectedRoom, setSelecedtRoom] = useState('')
  const [renderFavorited, setRenderFavorited] = useState()
  const user = useSelector((state) => state.user.currentUser)
  const usersRef = firebase.database().ref('users')
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      addListeners(user.uid)
    }
    return () => {
      usersRef.child(`${user.uid}/favorited`).off()
    }
  }, [selectedRoom])

  const addListeners = (userId) => {
    let newArr = []

    usersRef.child(`${userId}/favorited`).on('child_added', (snapshot) => {
      const room = { id: snapshot.key, ...snapshot.val() }

      // useState가 제대로 작동하지 않기때문에 배열에 추가
      newArr.push(room)
      renderFavoritedChatRooms(newArr)

      console.log(newArr)
    })

    usersRef.child(`${userId}/favorited`).on('child_removed', (snapshot) => {
      // useState가 제대로 작동하지 않기때문에 삭제할 배열의 index를 찾아서 배열에서 삭제
      const chatRoomToRemove = newArr.find((val) => {
        return val.id === snapshot.key
      })
      const removeRoomIndex = newArr.indexOf(chatRoomToRemove)
      newArr.splice(removeRoomIndex, 1)

      renderFavoritedChatRooms(newArr)

      console.log(newArr)
    })
  }

  const renderFavoritedChatRooms = (favoritedRoom) => {
    const result = favoritedRoom.map((chatRoom, index) => {
      return (
        <li
          key={chatRoom.id + index}
          onClick={() => saveChatRoomInfo(chatRoom)}
          style={{ backgroundColor: chatRoom.id === selectedRoom && '#ffff45', cursor: 'pointer' }}
        >
          {chatRoom.name}
        </li>
      )
    })
    setRenderFavorited(result)
    setFavoritedChatRooms(favoritedRoom)
  }

  const saveChatRoomInfo = (room) => {
    dispatch(setCurrentChatRoom(room, false))
    setSelecedtRoom(room.id)
  }

  return (
    <div>
      <span>Favoriteds ({favoritedChatRooms.length})</span>
      <ul>{renderFavorited}</ul>
    </div>
  )
}

export default Favorite
