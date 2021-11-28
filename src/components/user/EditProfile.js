import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import firebase from '../../firebase';
import { changeProfile, changeImage } from '../../redux/_actions/user_action';
import styled from 'styled-components';
import { ImCamera } from 'react-icons/im';

const Form = styled.form`
  padding: 115px 20px 20px;
  .my_info {
    text-align: center;
    & > div {
      position: relative;
      display: inline-block;
      button {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 30px;
        height: 30px;
        border: 1px solid #f2f2f2;
        border-radius: 15px;
        background-color: #fff;
        text-align: center;
        z-index: 3;
        svg {
          font-size: 0.9rem;
          color: #737373;
        }
      }
    }
    & > p {
      margin: 15px 0 60px;
      font-size: 0.9rem;
      b {
        margin-right: 15px;
      }
    }
  }
  .my_info_edit {
    padding: 0 10px;
    label {
      display: block;
      margin: 25px 0 7px;
      font-weight: 500;
      font-size: 0.85rem;
      span {
        margin-left: 2px;
        font-size: 0.78rem;
        color: #737373;
        font-weight: 400;
      }
    }
    input,
    textarea {
      width: 100%;
      border: 1px solid #e7e7e8;
      border-radius: 5px;
    }
    #username {
      height: 36px;
      padding: 0 10px;
      font-size: 0.8rem;
    }
    #status {
      height: 59px;
      padding: 10px;
      resize: none;
      font-size: 0.8rem;
    }
    button {
      display: block;
      margin: 30px auto 0;
      padding: 8px 40px;
      font-size: 0.85rem;
      background-color: #367af5;
      border: 0;
      color: #fff;
      border-radius: 20px;
    }
  }
  .profile_img {
    width: 95px;
    height: 95px;
    border: 1px solid #f2f2f2;
    border-radius: 50%;
  }
`;

function EditProfile() {
  const user = useSelector((state) => state.user.currentUser);
  const statusMessage = useSelector((state) => state.user.currentUser.statusMessage);
  const statusName = useSelector((state) => state.user.currentUser.statusName);
  const usersRef = firebase.database().ref('users');
  const [formValue, setFormValue] = useState({
    status: statusMessage ? statusMessage : '',
    username: user.displayName,
    file: null,
    src: user.photoURL,
  });
  const { username, file, src, status } = formValue;
  const dispatch = useDispatch();
  const changeImageRef = useRef();
  const history = useHistory();

  useEffect(() => {
    if (user && statusMessage) {
      setFormValue({
        ...formValue,
        status: statusMessage,
      });
    }
    if (user && statusName) {
      setFormValue({
        ...formValue,
        username: statusName,
      });
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleOpenImage = (e) => {
    e.preventDefault();
    changeImageRef.current.click();
  };

  const handleChangeImage = (e) => {
    let reader = new FileReader();
    let files = e.target.files[0];

    reader.onloadend = () => {
      const base64 = reader.result;
      if (base64) {
        setFormValue({
          ...formValue,
          src: base64.toString(),
          file: files,
        });
      }
    };
    reader.readAsDataURL(files);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      // 상태메시지 수정+ 이름 수정
      await usersRef.child(user.uid).update({ statusMessage: status, name: username });

      // 프로필 수정한다면
      if (file !== null) {
        // 스토리지 파일 저장
        const metadata = { contentType: file.type };
        const uploadTask = await firebase
          .storage()
          .ref()
          .child(`user_image/${user.uid}`)
          .put(file, metadata);

        let downloadUrl = await uploadTask.ref.getDownloadURL();

        // 프로필 이미지 수정
        await firebase.auth().currentUser.updateProfile({ photoURL: downloadUrl });
        await usersRef.child(user.uid).update({ image: downloadUrl });

        dispatch(changeImage(downloadUrl));
      } else {
        //프로필 수정하지 않았다면
        // await firebase.auth().currentUser.updateProfile({ displayName: username })
      }

      dispatch(changeProfile(status, username));
      alert('성공적으로 변경되었습니다!');
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header className="talk_title">
        <h1>프로필 관리</h1>
      </header>
      <Form onSubmit={handleEditProfile}>
        <section>
          <article className="my_info">
            <div>
              <input
                onChange={handleChangeImage}
                accept="image/jpeg, image/png"
                type="file"
                name="file"
                ref={changeImageRef}
                style={{ display: 'none' }}
              />
              <Avatar alt={user.name} src={user && src} className="profile_img" />
              <button type="button" onClick={handleOpenImage}>
                <ImCamera />
              </button>
            </div>
            <p>
              <b>ID</b>
              {user && user.email}
            </p>
          </article>
          <article className="my_info_edit">
            <label>
              이름 <span>(20)</span>
            </label>
            <input
              id="username"
              name="username"
              value={username}
              placeholder="유저네임"
              onChange={onChange}
              maxLength="20"
              required
            />
            <label>
              상태메시지 <span>(60)</span>
            </label>
            <textarea
              id="status"
              name="status"
              value={status}
              placeholder="상태메시지"
              onChange={onChange}
              maxLength="60"
            />
            <button type="submit" onSubmit={handleEditProfile}>
              적용
            </button>
          </article>
        </section>
      </Form>
    </>
  );
}

export default EditProfile;
