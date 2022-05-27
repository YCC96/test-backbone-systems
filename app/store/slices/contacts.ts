import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "..";

export const ContactsSlice = createSlice({
  name: "contacts",

  initialState: {
    data: null,
    dataSelected: null,
  },

  reducers: {
    setContactsData: (state, action) => {
      state.data = action.payload;
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      if (!action.payload.contacts.data) {
        return state;
      }
      state.data = action.payload.contacts.data;
    },
  },
});

export const { setContactsData } = ContactsSlice.actions;

export const selectContacts = (state: AppState) => state.contacts;

export default ContactsSlice.reducer;
