import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import close from '../../assets/images/close.png';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import defaultIcon from '../../assets/images/default_icon.png';

const Form = styled.form`
  height: 100%;
  overflow-y: auto;
  padding-top: 40px;
  .register_tit {
    padding: 20px 0;
    font-size: 1.6rem;
    text-align: center;
  }
  .input_box {
    li {
      width: 330px;
      margin: 40px auto 20px;
      label {
        display: block;
        margin-bottom: 8px;
        font-size: 0.9rem;
        font-weight: 700;
      }
      & > div {
        position: relative;
        &:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 0;
          background-color: #403631;
          transition: width 120ms cubic-bezier(0, 0, 0.2, 1);
        }
        &.focus {
          &:after {
            width: 100%;
          }
        }
        input {
          height: 44px;
          width: 100%;
          padding: 0 40px 0 0;
          border: 0;
          border-bottom: 2px solid #f5f5f5;
          &::placeholder {
            color: #111;
          }
        }
        .btn_del {
          position: absolute;
          right: 0;
          bottom: 14px;
          z-index: 2;
          display: none;
          border: 0;
          border-radius: 17px;
          width: 17px;
          height: 17px;
          color: #fff;
          background: #b1b1b1 url(${close}) center center / 70% 70% no-repeat;
          cursor: pointer;
        }
      }
      .btn_submit {
        width: 100%;
        height: 50px;
        margin: 10px 0 35px;
        text-align: center;
        border: 0;
        border-radius: 5px;
        color: #323232;
        background-color: #f5f5f5;
        font-size: 0.9rem;
        &.enable {
          background-color: #f7be16;
          color: #323232;
        }
      }
      a {
        display: block;
        padding-top: 95px;
        text-align: center;
        color: #6e6e6e;
        font-size: 14px;
      }
      .info_error {
        font-size: 0.78rem;
      }
    }
  }
`;

function RegisterPage() {
  const { register, watch, errors, clearErrors, setValue, handleSubmit } =
    useForm();
  const [loading, setLoading] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState('');
  const [enable, setEnable] = useState('');
  const [focus, setFocus] = useState({
    email: '',
    password: '',
    confirm_password: '',
    name: '',
  });
  const [display, setDisplay] = useState({
    email: 'none',
    password: 'none',
    confirm_password: 'none',
    name: 'none',
  });
  const passwordRef = useRef();
  passwordRef.current = watch('password');

  const inputBox = useRef();
  const btnSubmit = useRef();

  const onChange = e => {
    const { value, name } = e.target;

    // input의 길이가 0이싱이면 삭제버튼이 나타나고 focus 효과
    if (value.length > 0) {
      setDisplay({ ...display, [name]: 'block' });
      setFocus({ ...focus, [name]: 'focus' });
    } else {
      setDisplay({ ...display, [name]: 'none' });
      setFocus({ ...focus, [name]: '' });
    }

    // 가입완료 버튼 활성화
    if (
      watch('password').length > 7 &&
      watch('confirm_password').length > 7 &&
      watch('name').length > 3
    ) {
      setEnable('enable');
      setLoading(false);
    } else {
      setEnable('');
      setLoading(true);
    }
  };

  const inputReset = e => {
    e.preventDefault();
    const { name } = e.target.previousSibling;

    // 클릭되면 버튼 사라짐, focus ui 효과 사라짐
    setDisplay({ ...display, [name]: 'none' });
    setFocus({ ...focus, [name]: '' });

    // 클릭되면 가입완료 버튼 disable 처리됨
    setEnable('');
    setLoading(true);

    setValue(name, '');
    clearErrors(name, '');
  };

  const onSubmit = async data => {
    try {
      setLoading(true);
      let createUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);

      await createUser.user.updateProfile({
        displayName: data.name,
        photoURL: defaultIcon,
      });

      // firebase DB save - uid: user의 유니크한 id
      await firebase.database().ref('users').child(createUser.user.uid).set({
        name: createUser.user.displayName,
        image: createUser.user.photoURL,
        email: createUser.user.email,
      });

      setErrorSubmit(
        '성공적으로 회원가입이 되었습니다. 로그인 페이지로 이동합니다.',
      );
    } catch (error) {
      setErrorSubmit(error.message);
    } finally {
      setLoading(false);
      setEnable('');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <section>
        <h1 className="register_tit">회원가입</h1>
        <ul className="input_box ph_text_field" ref={inputBox}>
          <li>
            <label>계정 이메일 (회원 ID)</label>
            <div className={focus.email === '' ? '' : 'focus'}>
              <input
                name="email"
                type="email"
                ref={register({
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                placeholder="이메일 입력"
                onChange={onChange}
              />
              <span
                className="btn_del"
                onClick={inputReset}
                style={{ display: display.email === 'none' ? 'none' : 'block' }}
              />
            </div>
            {errors.email && (
              <p className="info_error">유효한 이메일 주소가 아닙니다.</p>
            )}
          </li>
          <li>
            <label>비밀번호</label>
            <div className={focus.password === '' ? '' : 'focus'}>
              <input
                name="password"
                type="password"
                ref={register({
                  required: true,
                  minLength: 8,
                  maxLength: 20,
                })}
                placeholder="비밀번호(8~20자리)"
                onChange={onChange}
              />
              <span
                className="btn_del"
                onClick={inputReset}
                style={{
                  display: display.password === 'none' ? 'none' : 'block',
                }}
              />
            </div>
            <p className="info_error">
              {errors.password &&
                errors.password.type === 'required' &&
                '비밀번호를 입력해주세요.'}
              {errors.password &&
                errors.password.type === 'maxLength' &&
                '비밀번호는 8-20자리로 입력해주세요.'}
            </p>
            <div className={focus.confirm_password === '' ? '' : 'focus'}>
              <input
                name="confirm_password"
                type="password"
                ref={register({
                  required: true,
                  validate: value => value === passwordRef.current,
                })}
                minLength="8"
                maxLength="20"
                placeholder="비밀번호 재입력"
                onChange={onChange}
              />
              <span
                className="btn_del"
                onClick={inputReset}
                style={{
                  display:
                    display.confirm_password === 'none' ? 'none' : 'block',
                }}
              />
            </div>
            <p className="info_error">
              {errors.confirm_password &&
                errors.confirm_password.type === 'required' &&
                '비밀번호를 재입력해주세요.'}
              {errors.confirm_password &&
                errors.confirm_password.type === 'validate' &&
                '입력한 비밀번호와 재입력한 비밀번호가 일치하지 않습니다.'}
            </p>
          </li>
          <li>
            <label>닉네임</label>
            <div className={focus.name === '' ? '' : 'focus'}>
              <input
                name="name"
                type="text"
                ref={register({
                  required: true,
                  maxLength: 20,
                })}
                placeholder="닉네임을 입력해 주세요."
                onChange={onChange}
              />
              <span
                className="btn_del"
                onClick={inputReset}
                style={{ display: display.name === 'none' ? 'none' : 'block' }}
              />
            </div>
            <p className="info_error">
              {errors.name &&
                errors.name.type === 'required' &&
                '닉네임을 입력해주세요.'}
              {errors.name &&
                errors.name.type === 'maxLength' &&
                '닉네임은 20자리까지 입력가능합니다.'}
            </p>
          </li>
          <li>
            <button
              ref={btnSubmit}
              className={`btn_submit ${enable}`}
              disabled={loading}
            >
              가입 완료
            </button>
            {errorSubmit && <p className="info_error">{errorSubmit}</p>}
            <Link to="/login">처음으로 돌아가기 </Link>
          </li>
        </ul>
      </section>
    </Form>
  );
}

export default RegisterPage;
