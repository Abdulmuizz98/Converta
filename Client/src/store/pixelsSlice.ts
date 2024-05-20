import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ERROR, notify } from "./notificationSlice";
import { getConfig } from "./authSlice";
import { logout } from "./authSlice";
// import { RootState } from ".";

const endpoint = "http://localhost:3000/converta/api";

// Define an async thunk action creator
export const getPixels = createAsyncThunk(
  "pixels/getPixels",
  async (_, { dispatch, getState }) => {
    try {
      const user = getState().auth.user;
      const response = await axios.get(
        `${endpoint}/user/${user.id}/pixels`,
        getConfig(user.token)
      );
      return { pixels: response.data };
    } catch (err) {
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

// export const deleteLead = createAsyncThunk(
//   "pixels/deleteLead",
//   async (id, { getState }) => {
//     await axios.delete(`/api/leads/${id}/`, getConfig(getState().auth.token));
//     return { id };
//   }
// );

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
      user_id: user.id,
    };
    console.log("Pixel payload: ", payload);

    try {
      const response = await axios.post(
        `${endpoint}/pixel`,
        payload,
        getConfig(user.token)
      );
      return response.data;
    } catch (err) {
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
  user_id: string;
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
  reducers: {
    // getLeads(state, action) {
    //   state.leads = action.payload;
    // },
    // toggleMenu(state) {
    //   state.isOpen = !state.isOpen;
    // },
  },
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
      // .addCase(deleteLead.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(deleteLead.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.leads = state.leads.filter(
      //     (lead) => lead.id !== action.payload.id
      //   );
      // })
      // .addCase(deleteLead.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message;
      // })
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
