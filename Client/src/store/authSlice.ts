import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ERROR, notify } from "./notificationSlice";
import { AppDispatch } from ".";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface ErrorResponse {
  msg: string;
  status: number;
  type: string;
}

interface User {
  id: string | null;
  username: string | null;
  email: string | null;
  token: string;
}

interface AxiosConfig {
  headers: {
    "Content-Type": string;
    Authorization?: string;
    // Add more headers as needed
  };
}

// const SERVICE_URI = "http://localhost:5121";

export const getConfig = (token: StringOrNull) => {
  const config: AxiosConfig = {
    headers: {
      "Content-Type": "application/json", // You can add more headers as needed
    },
  };

  if (token) config.headers["Authorization"] = `Bearer ${token}`;

  return config;
};

// Register user with email, password and username
export const register = createAsyncThunk<
  User,
  RegisterCredentials,
  { dispatch: AppDispatch }
>("auth/register", async (newUser, { dispatch }) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      newUser.password
    );

    // Update user profile with displayName
    await updateProfile(userCredential.user, {
      displayName: newUser.username,
    });

    console.log("userCredential: ", userCredential);
    const user: User = {
      id: userCredential.user.uid,
      username: userCredential.user.displayName,
      email: userCredential.user.email,
      token: await userCredential.user.getIdToken(),
    };
    console.log("user: ", user);

    return user;
  } catch (err: any) {
    const payload = {
      msg: err.message,
      status: err.code,
      type: ERROR,
    };
    dispatch(notify(payload));
    throw err;
  }
});

export const login = createAsyncThunk<
  User,
  LoginCredentials,
  { dispatch: AppDispatch }
>("auth/login", async ({ email, password }, { dispatch }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("userCredential: ", userCredential);
    // Return the user object
    const user: User = {
      id: userCredential.user.uid,
      username: userCredential.user.displayName,
      email: userCredential.user.email,
      token: await userCredential.user.getIdToken(),
      // refreshToken: user.refreshToken,
    };
    console.log("user: ", user);

    return user;
  } catch (err: any) {
    console.log(err);
    const payload: ErrorResponse = {
      msg: err.message,
      status: err.code,
      type: ERROR,
    };
    dispatch(notify(payload));
    throw err;
  }
});

type UserOrNull = User | null;
type StringOrNull = string | null;
type StringOrUndef = string | undefined;

interface AuthStateInterface {
  isAuthenticated: boolean;
  loading: boolean;
  user: UserOrNull;
  error: StringOrUndef;
}

const localUser = localStorage.getItem("conv_user");
const storedUser = localUser ? JSON.parse(localUser) : null;
const user =
  storedUser && typeof storedUser === "object" ? (storedUser as User) : null;

const initialState: AuthStateInterface = {
  isAuthenticated: false,
  loading: false,
  user,
  error: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError(state) {
      state.error = undefined;
    },
    logout(state) {
      localStorage.removeItem("conv_user");
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    getUser(state) {
      const user = localStorage.getItem("conv_user");
      if (user) {
        state.isAuthenticated = true;
        state.user = JSON.parse(user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("conv_user", JSON.stringify(action.payload));
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        localStorage.removeItem("conv_user");
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        localStorage.setItem("conv_user", JSON.stringify(action.payload));
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        localStorage.removeItem("conv_user");
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message;
      });
  },
});

export const { resetError, logout, getUser } = authSlice.actions;
export default authSlice;
