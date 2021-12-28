import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import { useState } from 'react';
import defaultIcon from '../../../assets/images/default_icon.png';

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
      padding: 5px 12px;
      border-radius: 12px;
      font-size: 0.9rem;
      &:after {
        content: '';
        display: block;
        width: 0px;
        height: 0px;
        border: 5px solid;
        position: absolute;
        top: 6px;
        border-radius: 3px;
      }
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
      span {
        padding-right: 7px;
        text-align: right;
        right: 100%;
      }
      p {
        background-image: linear-gradient(to right, #6c4bf4, #515af5);
        color: #fff;
        /* background-color: #ffeb33; */
        &:after {
          transform: rotate(-180deg);
          right: -8px;
          border-color: transparent #515af5 #515af5 transparent;
        }
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
        background-color: #f1f1f1;
        &:after {
          transform: rotate(-90deg);
          left: -8px;
          border-color: transparent #f1f1f1 #f1f1f1 transparent;
        }
      }
    }
  }
`;

function Message({ message, user }) {
  // const [getImage, setGetImage] = useState(defaultIcon);
  const timeFromNow = timestamp => moment(timestamp).fromNow();
  // const allFriendsList = useSelector(
  //   state => state.user.currentUser.allFriendsList,
  // );

  // useEffect(() => {
  //   allFriendsList &&
  //     allFriendsList.filter(val => {
  //       if (val.id === message.user.id) return setGetImage(val.image);
  //     });
  // }, [allFriendsList, message.user.id]);

  // const isImage = message =>
  //   message.hasOwnProperty('image') && !message.hasOwnProperty('content');

  return (
    // 내가 쓴 메시지는 right
    <Li className={user && message.user.id === user.uid ? 'me' : 'other'}>
      {/* {message.user.id !== user.uid && (
        <Avatar alt={message.user.name} src={getImage} />
      )} */}
      <div className="text_bubbles">
        {user && message.user.id !== user.uid && (
          <strong>{message.user.name}</strong>
        )}
        {/* {isImage(message) ? (
          <img src={message.image} alt="" />
        ) : (
          <p>{message.content}</p>
        )} */}
        <p>{message.content}</p>
        <span>{timeFromNow(message.timestamp)}</span>
      </div>
    </Li>
  );
}

export default Message;
