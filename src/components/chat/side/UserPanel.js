import React, { useState, useRef } from 'react';
import { Menu, MenuItem, Avatar } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import firebase from '../../../firebase';
import { changeImage } from '../../../redux/_actions/user_action';
import { IoSettingsSharp } from 'react-icons/io5';

function UserPanel() {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector((state) => state.user.currentUser);
  const changeImageRef = useRef();
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setAnchorEl(null);
    firebase.auth().signOut();
  };
  const handleOpenImage = () => {
    setAnchorEl(null);
    changeImageRef.current.click();
  };

  const handleChangeImage = async (e) => {
    // https://firebase.google.com/docs/storage/web/upload-files?hl=ko  -> 파일 메타데이터 추가

    const file = e.target.files[0];
    const metadata = { contentType: file.type };

    // 스토리지 파일 저장
    try {
      const uploadTask = await firebase
        .storage()
        .ref()
        .child(`user_image/${user.uid}`)
        .put(file, metadata);
      let downloadUrl = await uploadTask.ref.getDownloadURL();

      // 프로필 이미지 수정
      await firebase.auth().currentUser.updateProfile({
        photoURL: downloadUrl,
      });

      // 리덕스 프로필 이미지 수정
      dispatch(changeImage(downloadUrl));

      //DB에 이미지 url 저장
      await firebase.database().ref('users').child(user.uid).update({ image: downloadUrl });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <IoSettingsSharp onClick={handleClick} />
      <Avatar alt="Remy Sharp" src={user && user.photoURL} />
      {user && user.displayName}
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleOpenImage}>사진변경</MenuItem>
        <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
      </Menu>

      <input
        onChange={handleChangeImage}
        accept="image/jpeg, image/png"
        type="file"
        ref={changeImageRef}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default UserPanel;
