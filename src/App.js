import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import LoginPage from './components/user/LoginPage';
import RegisterPage from './components/user/RegisterPage';
import firebase from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  logoutUser,
  loadStatusMessage,
  loadStatusName,
  loadAllFriendsList,
} from './redux/_actions/user_action';
import { setCurrentChatFriend } from './redux/_actions/chat_action';
import EditPassword from './components/user/EditPassword';
import CircularProgress from '@material-ui/core/CircularProgress';
import UserInfo from './components/user/UserInfo';
import FriendsList from './components/user/FriendsList';
import SidePanel from './components/chat/side/SidePanel';
import ChatList from './components/chat/ChatList';
import EditProfile from './components/user/EditProfile';
import ChatPage from './components/chat/talk/ChatPage';

function App() {
  const [sideShow, setSideShow] = useState(false);
  const { isLoading, currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const usersRef = firebase.database().ref('users');
  const nowHistoryPath = history.location.pathname;

  /*
    displayName:회원가입 시 작성되고 수정 o, 닉네임,
    email: 회원가입 시 작성하는 이메일 (수정x) -> 아이디로 사용됨,
    statusMessage : 회원가입 후 프로필 수정에서 수정할 수 있는 상태메시지 (수정 o)
    alarmStatus: 수정o
  */

  useEffect(() => {
    // 현재 로그인한 사용자 가져오기
    firebase.auth().onAuthStateChanged(user => {
      // 로그인된 상태
      if (user) {
        if (
          nowHistoryPath === '/login' ||
          nowHistoryPath === '/register' ||
          nowHistoryPath === '/edit/password'
        ) {
          history.push('/');
        }
        dispatch(loginUser(user));

        // 유저 상태메시지, 닉네임, 알림설정여부 가져오기(displayName과 다름)
        usersRef.child(`${user.uid}`).on('value', snapshot => {
          // console.log(snapshot.val().alarmStatus)
          if (snapshot.val() && snapshot.val().statusMessage) {
            const { statusMessage } = snapshot.val();
            dispatch(loadStatusMessage(statusMessage));
          }
          if (snapshot.val() && snapshot.val().name) {
            const { name } = snapshot.val();
            dispatch(loadStatusName(name));
          }
          // 현재 채팅중인 친구 새로고침해도 유지하게
          if (snapshot.val() && snapshot.val().currentChatFriend) {
            const { currentChatFriend } = snapshot.val();
            dispatch(setCurrentChatFriend(currentChatFriend));
          }
        });
        setSideShow(true);

        // user들의 image정보를 가져오기 위해
        loadUserList(user);
      } else {
        // 비로그인일때 로그인페이지로 이동
        if (
          nowHistoryPath !== '/login' ||
          nowHistoryPath !== '/register' ||
          nowHistoryPath !== '/edit/password'
        ) {
          history.push('/login');
        }
        dispatch(logoutUser(user));
        setSideShow(false);
      }
    });
    return () => {
      usersRef.off();
    };
  }, [nowHistoryPath, history]);

  const loadUserList = user => {
    let userArr = [];
    usersRef.on('child_added', snapshot => {
      const newObj = snapshot.val();
      // key로 받아온 id값은 새롭게 추가
      newObj.id = snapshot.key;

      // 나를 제외한 user 목록 불러와서 배열에 추가
      if (newObj.id !== user.uid) {
        userArr.push(newObj);
      }
      if (userArr.length > 0) {
        dispatch(loadAllFriendsList(userArr));
      }
    });
  };

  return (
    <div id="container">
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {sideShow && <SidePanel key={currentUser && currentUser.uid} />}
          <div className={sideShow ? 'layout_content' : 'user_content'}>
            <Switch>
              <Route path="/login" exact component={LoginPage} />
              <Route path="/register" exact component={RegisterPage} />
              <Route path="/edit/password" exact component={EditPassword} />
              <Route path="/" exact component={FriendsList} />
              <Route path="/chat" exact component={ChatList} />
              <Route path="/chat/:id" exact component={ChatPage} />
              <Route path="/edit/profile" exact component={EditProfile} />
              <Route path="/about" exact component={UserInfo} />
              <Redirect from="*" to="/" />
            </Switch>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
