import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import { GrFormPreviousLink } from 'react-icons/gr';
import styled from 'styled-components';
import firebase from '../../../firebase';
import { Menu, MenuItem } from '@material-ui/core';
import { IoMenuOutline } from 'react-icons/io5';

const Header = styled.header`
  position: fixed;
  z-index: 1;
  width: 100%;
  left: 0;
  top: 0;
  &.open + ul {
    margin-top: 45px;
  }
  & > section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 15px;
    background-color: #f3f3f3;
    .sch_btn {
      svg {
        font-size: 1.4rem;
        color: #6c7780;
      }
    }
    .left {
      display: flex;
      align-items: center;
      button {
        padding-top: 4px;
        svg {
          font-size: 1.5rem;
        }
      }
      p {
        margin: -2px 0 0 4px;
        color: #4a4c4e;
        font-size: 1rem;
        font-weight: 700;
      }
    }
  }
  .sch_box {
    position: absolute;
    left: 0;
    z-index: 5;
    width: 100%;
    padding: 0 10px 10px;
    background-color: #f3f3f3;
    input {
      width: 100%;
      height: 40px;
      padding: 0 10px;
      border: 1px solid #999999;
      border-radius: 5px;
    }
  }
`;

const SettingMenu = styled(Menu)`
  margin: 45px 0 0 -69px;
  li,
  a {
    font-size: 0.9rem;
    font-weight: 700;
  }
`;

const SettingButton = styled.button`
  margin-left: 12px;
  bottom: 20px;
  font-size: 1.1rem;
`;

const SettingsSharp = styled(IoMenuOutline)`
  color: #6c7780;
  font-size: 1.8rem;
  &:hover,
  &.active {
    color: #343740;
  }
`;

function TalkHeader({ handleSearchChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState(false);
  const chatFriend = useSelector(state => state.chat.currentChatFriend);
  const messagesRef = firebase.database().ref('messages');
  const storageRef = firebase.storage().ref();
  const history = useHistory();
  const settingBtn = useRef();

  useEffect(() => {
    return () => {
      messagesRef.off();
    };
  }, []);

  const historyGoBack = () => {
    history.goBack();
  };
  const handleSearchList = () => {
    setSearch(!search);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleRemoveRoom = () => {
    messagesRef.child(chatFriend.id).remove();
    storageRef
      .child(`/message/private/${chatFriend.id}`)
      .listAll()
      .then(listResults => {
        const promises = listResults.items.map(item => {
          return item.delete();
        });
        Promise.all(promises);
        console.log(promises);
      })
      .catch(error => {
        console.log(error);
      });

    history.push('/chat');
  };

  return (
    <Header className={search ? 'open' : ''}>
      <section>
        <article className="left">
          <button onClick={historyGoBack} title="이전으로">
            <GrFormPreviousLink />
          </button>
          <p>{chatFriend && chatFriend.name}</p>
        </article>
        <article className="right">
          <button className="sch_btn" onClick={handleSearchList} title="검색">
            <AiOutlineSearch />
          </button>
          <SettingButton onClick={handleClick} ref={settingBtn}>
            <SettingsSharp />
          </SettingButton>
          <SettingMenu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleRemoveRoom}>방 나가기</MenuItem>
          </SettingMenu>
        </article>
      </section>
      {search && (
        <div className="sch_box">
          <input
            name="search"
            placeholder="검색 내용을 입력해 주세요."
            onChange={handleSearchChange}
          />
        </div>
      )}
    </Header>
  );
}

export default TalkHeader;
