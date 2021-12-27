import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { IoMdSend } from 'react-icons/io';

const Form = styled.form`
  width: 90%;
  padding: 0 10px;
  input {
    width: 100%;
    height: 32px;
    margin-top: 10px;
    background-color: #f5f5f5;
    border-radius: 18px;
    padding: 0 15px;
    border: 0;
  }
`;

const ButtonArea = styled.div`
  position: absolute;
  top: 9px;
  right: -8px;
  width: 10%;
  button {
    font-size: 1.6rem;
    color: #377af6;
  }
`;

function MessageForm({ scrollToBottom }) {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = firebase.database().ref('messages');
  const chatRoom = useSelector(state => state.chat.currentChatFriend);
  const user = useSelector(state => state.user.currentUser);

  const onChange = e => {
    const { value } = e.target;
    setContent(value);
  };

  const createMessage = (file = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
      read: false,
    };

    if (file === null) {
      message['content'] = content;
    } else {
      message['image'] = file;
    }
    return message;
  };

  const onsubmit = async e => {
    if (!content) {
      alert('컨텐츠를 먼저 작성해주세요.');
      return;
    }
    setLoading(true);

    // firebase 메시지 저장
    try {
      await messagesRef.child(chatRoom.id).push().set(createMessage());
      setLoading(false);
      setContent('');
      setErrors([]);
      scrollToBottom();
    } catch (error) {
      setErrors(prev => prev.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onsubmit();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {errors}
      <Form onSubmit={onsubmit}>
        <input
          value={content}
          style={{ resize: 'none' }}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
      </Form>

      <ButtonArea>
        <button onClick={onsubmit} disabled={loading ? true : false}>
          <IoMdSend />
        </button>
      </ButtonArea>
    </div>
  );
}

export default MessageForm;
