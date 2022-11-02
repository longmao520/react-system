import { createStore, combineReducers } from "redux"
import collapseReducer from "./reducers/CollapsedReducer"
import loadingReducer from "./reducers/LoadingReducer"
// reudx 持久化
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['collapseReducer']
}
// 合并写 reducer
const reducer = combineReducers({
    loadingReducer,
    collapseReducer,
    // 后续还可以写很多的 reducer 进行 action 状态的处理
})
const persistedReducer = persistReducer(persistConfig, reducer)
// 创建store 
const store = createStore(persistedReducer)
const persistor = persistStore(store)
export { store, persistor } 