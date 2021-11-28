import React, { useState, useEffect } from 'react'
import MainPanel from './main/MainPanel'
import { useSelector, useDispatch } from 'react-redux'
import firebase from '../../firebase'
import { setCurrentChatRoom } from '../../redux/_actions/chat_action'

function ChatPage() {
  const [friend, setFriend] = useState(null)
  const currentUser = useSelector((state) => state.user.currentUser)
  const chatRoom = useSelector((state) => state.chat)
  const usersRef = firebase.database().ref('users')
  const dispatch = useDispatch()

  useEffect(() => {
    usersRef.child(`${currentUser.uid}`).on('value', (snapshot) => {
      const { currentChatFriend } = snapshot.val()
      dispatch(setCurrentChatRoom(currentChatFriend, true))
      setFriend(currentChatFriend)
    })
    return () => {
      usersRef.off()
    }
  }, [])

  return (
    <>
      {friend && chatRoom ? (
        <MainPanel key={chatRoom.currentChatFriend && chatRoom.currentChatFriend.id} />
      ) : (
        <MainPanel key={chatRoom.currentChatRoom && chatRoom.currentChatRoom.id} />
      )}
    </>
  )
}

export default ChatPage
