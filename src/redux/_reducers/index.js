import { combineReducers } from "redux";
import user from "./user_reducer";
import chat from "./chat_reducer";

// const persistConfig = {
//     key: "root",
//     storage,
//     whitelist: [user, chat],
// };

const rootReducer = combineReducers({
    user,
    chat,
});

export default rootReducer;
