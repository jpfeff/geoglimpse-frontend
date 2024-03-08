/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SERVER_URL from '../constants';
import apiRequest from '../services';

const initialState = {
  username: null,
  email: null,
  id: null,
  tileFrequency: {},
};

export const logout = createAsyncThunk('user/logout', async () => {
  try {
    const response = await apiRequest({
      method: 'post',
      url: `${SERVER_URL}/api/auth/logout`,
      withCredentials: true,
    });
    return null;
  } catch (error) {
    throw new Error(`Error logging out: ${error}`);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state, action) => null);
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
