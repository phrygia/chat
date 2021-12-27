import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

const Section = styled.section`
  padding: 0 15px;
  .my_info {
    margin-top: 70px;
    padding: 15px 20px;
    background-color: #ececed80;
    border: 1px solid #e7e7e8;
    border-radius: 5px;
    h3 {
      margin-bottom: 2px;
      font-size: 1rem;
    }
    p {
      font-size: 0.88rem;
      color: #737373;
    }
  }
  .app_info {
    display: flex;
    justify-content: space-between;
    padding: 12px 5px 0;
    p {
      font-size: 0.85rem;
      svg {
        position: relative;
        top: 4px;
        margin-right: 5px;
        font-size: 1.2rem;
      }
    }
    span {
      font-size: 0.8rem;
      color: #737373;
    }
  }
`;

function UserInfo() {
  const user = useSelector(state => state.user.currentUser);
  const statusName = useSelector(state => state.user.currentUser.statusName);
  const [name, setName] = useState(null);
  const { displayName, email } = user;

  useEffect(() => {
    if (user && statusName) {
      setName(statusName);
    }
  }, [statusName, user]);

  return (
    <div>
      <header className="talk_title">
        <h1>정보</h1>
      </header>
      <Section>
        <article className="my_info">
          <h3>{name ? name : displayName}</h3>
          <p>{email}</p>
        </article>
        <article className="app_info">
          <p>
            <AiOutlineExclamationCircle />
            프리지아톡 정보
          </p>
          <span>ver 1.0.0</span>
        </article>
      </Section>
    </div>
  );
}

export default UserInfo;
