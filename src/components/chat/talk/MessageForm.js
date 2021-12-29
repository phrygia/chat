import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import firebase from '../../../firebase';
import styled from 'styled-components';
import { IoMdPhotos } from 'react-icons/io';
import { RiSendPlaneFill } from 'react-icons/ri';
// import { MdAddPhotoAlternate } from 'react-icons/md';
import mime from 'mime-types';

const Form = styled.form`
  position: fixed;
  bottom: 60px;
  left: 0;
  z-index: 3;
  width: 100%;
  border-top: 1px solid #efefef;
  input {
    width: 100%;
    height: 45px;
    margin-top: 5px;
    border-radius: 18px;
    padding: 0 90px 0 15px;
    border: 0;
  }
`;

const ButtonArea = styled.div`
  display: flex;
  position: fixed;
  bottom: 60px;
  right: 10px;
  z-index: 3;
  text-align: right;
  button {
    font-size: 1.6rem;
    color: #15325b;
    &.send_img_btn {
      margin-right: 15px;
    }
  }
`;

function MessageForm({ scrollToBottom }) {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = firebase.database().ref('messages');
  const storageRef = firebase.storage().ref();
  const chatRoom = useSelector(state => state.chat.currentChatFriend);
  const user = useSelector(state => state.user.currentUser);
  const inputOpenImageRef = useRef();

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
    } catch (error) {
      setErrors(prev => prev.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }

    setTimeout(() => {
      scrollToBottom();
    }, 200);
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = event => {
    const file = event.target.files[0];
    const filePath = `/message/private/${chatRoom.id}/${file.name}`;
    const metadata = { contentType: mime.lookup(file.name) };
    setLoading(true);

    try {
      //파일을 먼저 스토리지에 저장
      let uploadTask = storageRef.child(filePath).put(file, metadata);

      //파일 저장되는 퍼센티지 구하기
      uploadTask.on(
        'state_changed',
        UploadTaskSnapshot => {
          console.log(UploadTaskSnapshot);
        },
        err => {
          console.error(err);
          setLoading(false);
        },
        () => {
          //저장이 다 된 후에 파일 메시지 전송 (데이터베이스에 저장)
          //저장된 파일을 다운로드 받을 수 있는 URL 가져오기
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            messagesRef
              .child(chatRoom.id)
              .push()
              .set(createMessage(downloadURL));
            setLoading(false);
          });
        },
      );
    } catch (error) {
      alert(error);
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
      <Form>
        <input
          value={content}
          style={{ resize: 'none' }}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지 입력..."
        />
      </Form>

      <ButtonArea>
        <button
          onClick={handleOpenImageRef}
          className="send_img_btn"
          disabled={loading ? true : false}
        >
          <IoMdPhotos />
        </button>
        <button onClick={onsubmit} disabled={loading ? true : false}>
          <RiSendPlaneFill />
        </button>
      </ButtonArea>

      <input
        accept="image/jpeg, image/png"
        style={{ display: 'none' }}
        type="file"
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
