import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from "../slices/themeSlice";
import sidebarReducer from "../slices/sidebarSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  theme: persistReducer(persistConfig, themeReducer),
  sidebar: persistReducer(persistConfig, sidebarReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
