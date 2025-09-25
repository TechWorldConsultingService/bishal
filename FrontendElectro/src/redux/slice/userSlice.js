import { createSlice } from '@reduxjs/toolkit';

const accessFromStorage = localStorage.getItem('accessToken') || null;
const refreshFromStorage = localStorage.getItem('refreshToken') || null;

const initialState = {
  accessToken: accessFromStorage,
  refreshToken: refreshFromStorage,
  user: null,
  isAuthenticated: Boolean(accessFromStorage),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { access, refresh, user } = action.payload;
      state.accessToken = access;
      state.refreshToken = refresh;
      state.user = user || null;
      state.isAuthenticated = true;
      if (access) localStorage.setItem('accessToken', access);
      if (refresh) localStorage.setItem('refreshToken', refresh);
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;


