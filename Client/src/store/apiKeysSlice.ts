import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ERROR, notify } from "./notificationSlice";
import { getConfig } from "./authSlice";
import { logout } from "./authSlice";

type ServiceId = "converta" | "anova";

interface ApiKeyResponse {
  service_id: ServiceId;
  apikey: string;
}
const SERVICE_URI = import.meta.env.VITE_SERVICE_URI;

// Define an async thunk action creator
export const getApiKey = createAsyncThunk(
  "apiKeys/getApiKey",
  async (serviceId: ServiceId, { dispatch, getState }) => {
    try {
      const user = getState().auth.user;
      const response = await axios.get(
        `${SERVICE_URI}/api/apikey/${serviceId}`,
        getConfig(user.token)
      );
      return response.data as ApiKeyResponse;
    } catch (err: any) {
      if (err.response.status === 403) {
        dispatch(logout());
      }
      const payload = {
        msg: err.response.data,
        status: err.response.status,
        type: ERROR,
      };
      dispatch(notify(payload));
      throw err;
    }
  }
);

// Define an async thunk action creator
export const createNewApiKey = createAsyncThunk(
  "apiKeys/createNewApiKey",
  async (serviceId: ServiceId, { dispatch, getState }) => {
    try {
      const user = getState().auth.user;
      const payload: { service_id: ServiceId } = {
        service_id: serviceId,
      };
      const response = await axios.post(
        `${SERVICE_URI}/api/apikey`,
        payload,
        getConfig(user.token)
      );
      return response.data as ApiKeyResponse;
    } catch (err: any) {
      if (err.response.status === 403) {
        dispatch(logout());
      }
      const payload = {
        msg: err.response.data,
        status: err.response.status,
        type: ERROR,
      };
      dispatch(notify(payload));
      throw err;
    }
  }
);

type ApiKeys = {
  [key in ServiceId]?: string;
};

interface ApiKeysInterface {
  keys: ApiKeys;
  loading: boolean;
  error: string | undefined;
}

const initialState: ApiKeysInterface = {
  keys: {},
  loading: false,
  error: "",
};
const apiKeysSlice = createSlice({
  name: "apiKeys",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getApiKey.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApiKey.fulfilled, (state, action) => {
        state.loading = false;
        state.keys[action.payload.service_id] = action.payload.apikey;
      })
      .addCase(getApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createNewApiKey.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewApiKey.fulfilled, (state, action) => {
        state.loading = false;
        state.keys[action.payload.service_id] = action.payload.apikey;
      })
      .addCase(createNewApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// export const {} = leadsSlice.actions;
export default apiKeysSlice;
