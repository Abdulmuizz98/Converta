import { configureStore } from "@reduxjs/toolkit";
// import { composeWithDevTools } from "redux-devtools-extension";
import pixelsSlice from "./pixelsSlice";
import notificationSlice from "./notificationSlice";
import authSlice from "./authSlice";
import apiKeysSlice from "./apiKeysSlice";

const store = configureStore({
  reducer: {
    pixels: pixelsSlice.reducer,
    notification: notificationSlice.reducer,
    auth: authSlice.reducer,
    apiKeys: apiKeysSlice.reducer,
  },
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
