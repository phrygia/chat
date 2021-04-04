import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
// import LandingPage from "./components/LandingPage";
import LoginPage from "./components/user/LoginPage";
import RegisterPage from "./components/user/RegisterPage";
// import EditPassword from "./components/user/EditPassword";
import Auth from "./hoc/auth";
import ChatPage from "./components/chat/ChatPage";

function App() {
    return (
        <div id="chat_container">
            <Router>
                <Switch>
                    <Route exact path="/" component={Auth(ChatPage, true)} />
                    <Route path="/login" component={Auth(LoginPage, false)} />
                    <Route
                        path="/register"
                        component={Auth(RegisterPage, false)}
                    />
                    {/* <Route
                        path="/user/:userName/pwEdit"
                        exact
                        component={EditPassword}
                    /> */}
                    <Redirect from="*" to="/" />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
