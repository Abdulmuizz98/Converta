import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
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
  apiKey: string | null;
}

// Function to create converta user from userId
async function registerConvertaUser(userId: string, token: string) {
  const endpoint = "http://localhost:3000/converta/api/user";
  try {
    const response = await axios.post(
      endpoint,
      {
        id: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include authentication token if required
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to register converta user");
    }
    console.log("Converta user registered successfully");
    return response.data; // Return the response data as apiKey
  } catch (error) {
    console.error("Error registering converta user:", error);
    throw error;
  }
}

// Function to call the server-side route and set API key for user
async function setApiKeyForUser(userId: string, token: string) {
  const endpoint = "http://localhost:3000/auth/set-api-key";
  try {
    const response = await axios.post(
      endpoint,
      {
        userId,
        service: "converta",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include authentication token if required
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to set API key");
    }
    console.log("API key set successfully");
    return response.data; // Return the response data as apiKey
  } catch (error) {
    console.error("Error setting API key:", error);
    throw error;
  }
}

async function getApiKeyForUser(userId: string, token: string) {
  const endpoint = "http://localhost:3000/auth/get-api-key";
  try {
    const response = await axios.post(
      endpoint,
      {
        userId,
        service: "converta",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include authentication token if required
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to get API key");
    }

    console.log("API key retrieved successfully");
    return response.data; // Return the response data as apiKey
  } catch (error) {
    console.error("Error getting API key:", error);
    throw error;
  }
}

// Create user with email, password, and displayName
const createUserWithEmailPasswordAndDisplayName = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update user profile with displayName
    await updateProfile(userCredential.user, {
      displayName: displayName,
    });

    const token = await userCredential.user.getIdToken();
    await registerConvertaUser(userCredential.user.uid, token);

    // Set custom claim 'apiKey' with the generated API key
    const apiKey = await setApiKeyForUser(userCredential.user.uid, token);
    // Return the user object
    return { userCredential, apiKey };
  } catch (error) {
    // Handle errors
    console.error("Error creating user:", error.message);
    throw error;
  }
};

export const login = createAsyncThunk<
  User,
  LoginCredentials,
  { dispatch: AppDispatch }
>("auth/login", async ({ email, password }, { dispatch }) => {
  console.log("i got here");
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // console.log(userCredential);

    const token = await userCredential.user.getIdToken();
    const apiKey = await getApiKeyForUser(userCredential.user.uid, token);
    console.log("ApiKEY: ", apiKey);

    // Return the user object
    const user: User = {
      id: userCredential.user.uid,
      username: userCredential.user.displayName,
      email: userCredential.user.email,
      token: await userCredential.user.getIdToken(),
      apiKey: apiKey.converta.apiKey,
      // refreshToken: user.refreshToken,
    };
    console.log(user);

    return user;

    // const body = JSON.stringify({ email, password });
    // const response = await axios.post("/api/auth/login", body, getConfig(null));
    // return response.data;
  } catch (err) {
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

export const register = createAsyncThunk<
  User,
  RegisterCredentials,
  { dispatch: AppDispatch }
>("auth/register", async (newUser, { dispatch }) => {
  try {
    const { userCredential, apiKey } =
      await createUserWithEmailPasswordAndDisplayName(
        newUser.email,
        newUser.password,
        newUser.username
      );
    console.log(userCredential);
    const user: User = {
      id: userCredential.user.uid,
      username: userCredential.user.displayName,
      email: userCredential.user.email,
      token: await userCredential.user.getIdToken(),
      apiKey: apiKey.converta.apiKey,
    };
    return user;
  } catch (err) {
    const payload = {
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

const initialState: AuthStateInterface = {
  isAuthenticated: false,
  loading: false,
  user: null,
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

interface AxiosConfig {
  headers: {
    "Content-Type": string;
    Authorization?: string;
    // Add more headers as needed
  };
}

export const getConfig = (token: StringOrNull) => {
  const config: AxiosConfig = {
    headers: {
      "Content-Type": "application/json", // You can add more headers as needed
    },
  };

  if (token) config.headers["Authorization"] = `Bearer ${token}`;

  return config;
};
