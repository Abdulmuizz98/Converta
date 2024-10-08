import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ERROR, notify } from "./notificationSlice";
import { getConfig } from "./authSlice";
import { logout } from "./authSlice";

const SERVICE_URI = import.meta.env.VITE_SERVICE_URI;

// Define an async thunk action creator
export const getPixels = createAsyncThunk(
  "pixels/getPixels",
  async (_, { dispatch, getState }) => {
    try {
      const user = getState().auth.user;
      const response = await axios.get(
        `${SERVICE_URI}/api/pixel/mine`,
        getConfig(user.token)
      );
      return { pixels: response.data };
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

interface PixelInput {
  pixelId: string;
  pixelName: string;
  pixelType: string;
  pixelDescription: string;
  accessToken: string;
}
export const addPixel = createAsyncThunk(
  "pixels/addPixel",
  async (pixel: PixelInput, { dispatch, getState }) => {
    const user = getState().auth.user;

    const payload: Pixel = {
      id: pixel.pixelId,
      name: pixel.pixelName,
      pixel_type: pixel.pixelType,
      description: pixel.pixelDescription,
      access_token: pixel.accessToken,
    };

    try {
      const response = await axios.post(
        `${SERVICE_URI}/api/pixel`,
        payload,
        getConfig(user.token)
      );
      return response.data;
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

interface Pixel {
  id: string;
  name: string;
  pixel_type: string;
  description: string;
  access_token: string;
}

interface PixelStateInterface {
  pixels: Pixel[];
  loading: boolean;
  error: string | undefined;
}

const initialState: PixelStateInterface = {
  pixels: [],
  loading: false,
  error: "",
};
const pixelsSlice = createSlice({
  name: "pixels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPixels.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPixels.fulfilled, (state, action) => {
        state.loading = false;
        state.pixels = action.payload.pixels;
      })
      .addCase(getPixels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPixel.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPixel.fulfilled, (state, action) => {
        state.loading = false;
        state.pixels.push(action.payload);
      })
      .addCase(addPixel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// export const {} = leadsSlice.actions;
export default pixelsSlice;
