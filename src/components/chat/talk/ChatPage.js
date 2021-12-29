import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import firebase from '../../../firebase';
import styled from 'styled-components';
import MessageForm from './MessageForm';
import TalkHeader from './TalkHeader';
import moment from 'moment';

const Main = styled.main`
  height: 100%;
  overflow: hidden;
  background-color: #fff;
`;

const Ul = styled.ul`
  position: relative;
  padding: 70px 20px 0;
  height: calc(100% - 50px);
  overflow-y: auto;
  scrollbar-color: #f1f1f1 white;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 5.2px;
  }
  &::-webkit-scrollbar-track {
    background-color: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #404040;
  }
  &::-webkit-scrollbar-thumb:active {
    background: #808080;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

const Li = styled.li`
  display: inline-block;
  width: 100%;
  padding: 10px 0;
  width: 100%;
  [class*='circle'] {
    width: 40px;
    height: 40px;
    border-radius: 15px;
    background-color: #fff;
  }
  .text_bubbles {
    position: relative;
    max-width: 60%;
    span {
      position: absolute;
      bottom: 2px;
      width: 110px;
      font-size: 0.62rem;
      color: #404040;
    }
    p {
      position: relative;
      display: inline-block;
      padding: 8px 11px 7px;
      font-size: 15px;
      line-height: 1.4;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  }

  &.me {
    text-align: right;
    .text_bubbles {
      float: right;
      strong {
        display: none;
      }
      span {
        padding-right: 7px;
        text-align: right;
        right: 100%;
      }
      p {
        border-radius: 20px 20px 0 20px;
        background: #41689f;
        color: #fff;
      }
    }
  }
  &.other {
    display: flex;
    [class*='circle'] {
      margin-right: 15px;
    }
    .text_bubbles {
      strong {
        display: block;
        margin: -7px 0 3px;
        font-weight: 500;
        font-size: 0.72rem;
      }
      span {
        padding-left: 7px;
        left: 100%;
      }
      p {
        border-radius: 20px 20px 20px 0;
        background: #eee;
      }
    }
  }
`;

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const user = useSelector(state => state.user.currentUser);
  const chatFriend = useSelector(state => state.chat.currentChatFriend);
  const usersRef = firebase.database().ref('users');
  const messagesRef = firebase.database().ref('messages');
  const messagesEndRef = useRef();
  const timeFromNow = timestamp => moment(timestamp).fromNow();

  useEffect(() => {
    if (chatFriend && user) {
      addMessagesListener(chatFriend.id);
    }

    return () => {
      messagesRef.off();
      usersRef.off();
    };
  }, [chatFriend, user]);

  const addMessagesListener = id => {
    messagesRef.child(id).on('child_added', snapshot => {
      setMessages(prev => [...prev, snapshot.val()]);
    });

    setTimeout(() => {
      scrollToBottom();
    }, 250);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'end',
      });
    }
  };

  const handleSearchChange = e => {
    if (messages && messages.length > 0) {
      const { value } = e.target;

      setSearchTerm(value);

      const chatMessages = [...messages];
      const regex = new RegExp(value, 'gi');

      const scrResult = chatMessages.reduce((acc, msg) => {
        if (msg.content.match(regex)) {
          acc.push(msg);
        }
        return acc;
      }, []);

      const result = scrResult.map((msg, idx) => {
        const { content, timestamp } = msg;
        return (
          <Li
            key={timestamp + idx}
            className={msg.user.id === user.uid ? 'me' : 'other'}
          >
            <div className="text_bubbles">
              {/* {user && user.id !== user.uid && <strong>{msg.user.name}</strong>} */}
              <p>{content}</p>
              <span>{timeFromNow(timestamp)}</span>
            </div>
          </Li>
        );
      });
      setSearchResult(result);
    }
  };

  const messageList =
    messages.length > 0 &&
    messages.map((message, idx) => (
      <Li
        key={message.timestamp + idx}
        className={user && message.user.id === user.uid ? 'me' : 'other'}
      >
        <div className="text_bubbles">
          {/* {message.user.id !== user.uid && <strong>{message.user.name}</strong>} */}
          <p>{message && message.content}</p>
          <span>{timeFromNow(message.timestamp)}</span>
        </div>
      </Li>
    ));

  return (
    <Main>
      <TalkHeader handleSearchChange={handleSearchChange} id={chatFriend} />
      <Ul style={{ overflowY: 'auto' }}>
        {searchTerm ? searchResult : messageList}
        <li style={{ height: '1px', width: '100%' }} ref={messagesEndRef} />
      </Ul>
      <MessageForm scrollToBottom={scrollToBottom} />
    </Main>
  );
}

export default ChatPage;
