import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import { GrFormPreviousLink } from 'react-icons/gr';
import styled from 'styled-components';

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
    svg {
      font-size: 1.4rem;
      color: #6c7780;
    }
    .left {
      display: flex;
      align-items: center;
      button {
        padding-top: 4px;
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

function TalkHeader({ handleSearchChange }) {
  const [search, setSearch] = useState(false);
  const chatFriend = useSelector(state => state.chat.currentChatFriend);
  const history = useHistory();

  const historyGoBack = () => {
    history.goBack();
  };
  const handleSearchList = () => {
    setSearch(!search);
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
          <button onClick={handleSearchList} title="검색">
            <AiOutlineSearch />
          </button>
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
