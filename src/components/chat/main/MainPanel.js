import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import firebase from '../../../firebase'
import styled from 'styled-components'
import MessageForm from './MessageForm'
import TalkHeader from './TalkHeader'
import Message from './Message'
import { setCurrentChatRoom } from '../../../redux/_actions/chat_action'

const Main = styled.main`
  height: 100%;
  overflow: hidden;
  background-color: #fff;
`

const Ul = styled.ul`
  padding: 20px 20px;
  height: calc(100% - 110px);
  overflow-y: auto;
  scrollbar-color: #f1f1f1 white;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 5.2px;
  } /* 스크롤 바 */

  &::-webkit-scrollbar-track {
    background-color: #fff;
  } /* 스크롤 바 밑의 배경 */

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 10px;
  } /* 실질적 스크롤 바 */

  &::-webkit-scrollbar-thumb:hover {
    background: #404040;
  } /* 실질적 스크롤 바 위에 마우스를 올려다 둘 때 */

  &::-webkit-scrollbar-thumb:active {
    background: #808080;
  } /* 실질적 스크롤 바를 클릭할 때 */

  &::-webkit-scrollbar-button {
    display: none;
  } /* 스크롤 바 상 하단 버튼 */
`

function MainPanel() {
  const [messages, setMessages] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState('')
  const user = useSelector((state) => state.user.currentUser)
  const chatFriend = useSelector((state) => state.chat.currentChatFriend)
  const usersRef = firebase.database().ref('users')
  const messagesRef = firebase.database().ref('messages')
  const messagesEndRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if (chatFriend) {
      addMessagesListener(chatFriend.id)

      let currentChatFriendArr = []
      let filterArr = {
        id: '',
        name: '',
        description: '',
        createdBy: {},
      }
      usersRef.child(`${user.uid}/currentChatFriend`).on('child_added', (snapshot) => {
        currentChatFriendArr.push({ [snapshot.key]: snapshot.val() })
      })

      for (const key in currentChatFriendArr) {
        for (const keys in currentChatFriendArr[key]) {
          if (keys === 'createdBy') {
            filterArr.createdBy = currentChatFriendArr[key][keys]
          } else if (keys === 'description') {
            filterArr.description = currentChatFriendArr[key][keys]
          } else if (keys === 'name') {
            filterArr.name = currentChatFriendArr[key][keys]
          } else if (keys === 'id') {
            filterArr.id = currentChatFriendArr[key][keys]
          }
        }
      }
      dispatch(setCurrentChatRoom(filterArr, true))
      let arr = []
      messagesRef.child(`${filterArr.id}`).on('child_added', (snapshot) => {
        arr.push(snapshot.key)
        arr.map((val) => messagesRef.child(`${filterArr.id}/${val}`).update({ read: true }))
      })
    }

    return () => {
      messagesRef.off()
      usersRef.off()
    }
  }, [searchTerm, chatFriend])

  const addMessagesListener = useCallback(async (id) => {
    let messagesArr = []

    await messagesRef.child(id).on('child_added', (snapshot) => {
      messagesArr.push(snapshot.val())

      if (messagesArr.length > 0) {
        const result = messagesArr.map((message) => <Message key={message.timestamp} message={message} user={user} />)
        setMessages(result)
      }
    })
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'end',
      })
    }
  }

  const handleSearchChange = (e) => {
    if (messages && messages.length > 0) {
      const { value } = e.target

      setSearchTerm(value)

      const chatMessages = [...messages]
      const regex = new RegExp(value, 'gi')

      const scrResult = chatMessages.reduce((acc, msg) => {
        const { message, user } = msg.props
        if ((message.content && message.content.match(regex)) || user.displayName.match(regex)) {
          acc.push(msg)
        }
        return acc
      }, [])

      const result = scrResult.map((msg) => {
        const { message, user } = msg.props
        return <Message key={message.timestamp} message={message} user={user} />
      })
      setSearchResult(result)
      scrollToBottom()
    }
  }

  return (
    <Main>
      <TalkHeader handleSearchChange={handleSearchChange} />
      <Ul style={{ overflowY: 'auto' }}>
        {searchTerm ? searchTerm && searchResult : messages && messages}
        <li style={{ height: '1px', width: '100%' }} ref={messagesEndRef} />
      </Ul>
      <MessageForm scrollToBottom={scrollToBottom} />
    </Main>
  )
}

export default MainPanel
