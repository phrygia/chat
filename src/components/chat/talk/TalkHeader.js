import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import { GrFormPreviousLink } from 'react-icons/gr';
import styled from 'styled-components';

const Header = styled.header`
  position: relative;
  & > section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #f8f8fc;
    svg {
      font-size: 1.4rem;
      color: #6c7780;
    }
    .left {
      display: flex;
      align-items: center;
      p {
        margin: -2px 0 0 4px;
        color: #4a4c4e;
        font-size: 0.8rem;
        font-weight: 500;
      }
    }
  }
  .sch_box {
    position: absolute;
    left: 0;
    z-index: 5;
    width: 100%;
    padding: 0 10px 10px;
    background-color: #fdfdff;
    input {
      width: 100%;
      height: 30px;
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
    <Header>
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
