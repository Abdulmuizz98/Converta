import { createSlice } from "@reduxjs/toolkit";

export const ERROR = "error";
export const ALERT = "alert";
export const SUCCESS = "success";

const initialState = {
  type: "",
  message: "",
  status: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    notify(state, action) {
      // console.log("Action: ", action);
      state.message = action.payload;
    },
  },
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(addLead.pending, (state) => {
  //         state.loading = true;
  //       })
  //       .addCase(addLead.fulfilled, (state, action) => {
  //         state.loading = false;
  //         state.leads.push(action.payload.lead);
  //       })
  //       .addCase(addLead.rejected, (state, action) => {
  //         state.loading = false;
  //         console.log("Error: ", action);
  //         state.error = action.error.message;
  //       });
  //   },
});

export const { notify } = notificationSlice.actions;
export default notificationSlice;
