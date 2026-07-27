import { createSlice } from '@reduxjs/toolkit';

// Read a flat, normalized object from storage
const storedRaw = localStorage.getItem('userInfo');
let userInfoFromStorage = null;
let tokenFromStorage = null;

if (storedRaw) {
  try {
    const parsed = JSON.parse(storedRaw);
    // Handle both nested {data:{user,accessToken}} and flat {user,token} formats
    const inner = parsed?.data || parsed;
    userInfoFromStorage = inner?.user || inner;
    tokenFromStorage = inner?.accessToken || inner?.token || parsed?.token || null;
  } catch {
    userInfoFromStorage = null;
  }
}

const initialState = {
  userInfo: userInfoFromStorage,
  token: tokenFromStorage,
  isAuthenticated: !!userInfoFromStorage,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // Normalize regardless of server response shape
      const payloadData = action.payload?.data || action.payload;
      const user = payloadData?.user || payloadData;
      const token = payloadData?.accessToken || payloadData?.token || null;

      state.userInfo = user;
      state.token = token;
      state.isAuthenticated = true;

      // Save normalized flat object so refresh always works
      localStorage.setItem('userInfo', JSON.stringify({ user, token }));
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userInfo');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
