import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import icon from '../../assets/images/talk_icon2.png';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import { useEffect } from 'react';

const Form = styled.form`
  position: relative;
  padding-top: 140px;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: #15325b;

  header {
    img {
      width: 60px;
    }
    h1 {
      margin-bottom: 30px;
      font-size: 1.8rem;
      font-weight: 500;
      color: #fff;
    }
  }
  section {
    & > div {
      &.input_box {
        width: 330px;
        margin: 80px auto 10px;
        border: 1px solid #fff;
        border-radius: 5px;
        overflow: hidden;
        input {
          height: 45px;
          width: 100%;
          padding: 0 15px;
          background-color: #f5f5f5;
          border: 0;
          font-size: 0.9rem;
          &.password {
            border-top: 1px solid #41689f2e;
            font-weight: 900;
            letter-spacing: 1.5px;
            &::placeholder {
              font-weight: 400;
              letter-spacing: 0;
            }
          }
          &::placeholder {
            color: #111;
          }
        }
        &.error {
          border-color: #e65f3e;
          border-width: 2px;
          & + div {
            margin-top: -2px;
          }
        }
      }
      button {
        width: 330px;
        height: 50px;
        border: 0;
        border-radius: 5px;
        color: #fff;
        background-color: #41689f;
        font-size: 0.9rem;
        &.on {
          background-color: #f7be16;
          color: #323232;
        }
      }
    }
    .info_error {
      text-align: left;
      width: 330px;
      margin: 20px auto 0;
      font-size: 0.78rem;
    }
  }
`;

const Ul = styled.ul`
  position: absolute;
  display: flex;
  left: 0;
  bottom: 45px;
  width: 100%;
  justify-content: center;
  li {
    &:first-child {
      position: relative;
      &:after {
        content: '';
        width: 1px;
        height: 13px;
        position: absolute;
        right: 0;
        top: 8px;
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
    a {
      padding: 0 10px;
      color: #ffffff;
      font-size: 0.9rem;
    }
  }
`;

function LoginPage() {
  const { register, watch, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState('');
  const [enableClass, setEnableClass] = useState(false);
  const isMounted = useRef(null);
  const history = useHistory();

  // 메모리 누수 에러때문에 처리
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onChange = e => {
    // 로그인 조건: 이메일 10자리 이상 && 비밀번호 8자리 이상
    if (watch('email').length > 10 && watch('password').length > 7) {
      setLoading(false);
      setEnableClass('on');
    } else {
      setLoading(true);
      setEnableClass('');
    }
  };

  const onSubmit = async data => {
    try {
      setLoading(true);
      await firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);

      // 로그인 성공 후 친구목록으로 이동
      history.push('/');
    } catch (error) {
      setErrorSubmit(error.message);
    }
    if (isMounted.current) {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <header>
        <h1>Simple Messenger</h1>
        <img src={icon} alt="프리지아톡 로고" />
      </header>
      <section>
        <div className="input_box">
          <input
            className="email"
            name="email"
            type="email"
            ref={register({
              required: true,
              pattern: /^\S+@\S+$/i,
            })}
            placeholder="이메일 주소"
            onChange={onChange}
          />
          <input
            className="password"
            name="password"
            type="password"
            ref={register({
              required: true,
              minLength: 8,
              maxLength: 20,
            })}
            minLength="8"
            maxLength="20"
            placeholder="비밀번호"
            onChange={onChange}
          />
        </div>
        <div>
          <button type="submit" className={`${enableClass}`} disabled={loading}>
            로그인
          </button>
        </div>
        {errorSubmit && <p className="info_error">{errorSubmit}</p>}
      </section>
      <Ul>
        <li>
          <Link to="/register">회원가입</Link>
        </li>
        <li>
          <Link to="/edit/password">비밀번호 재설정</Link>
        </li>
      </Ul>
    </Form>
  );
}

export default LoginPage;
