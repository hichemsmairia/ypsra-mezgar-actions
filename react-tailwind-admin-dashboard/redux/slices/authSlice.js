import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, update } from "../../src/services/AuthServices";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, thunkAPI) => {
    try {
      const response = await register(data);
      console.log(response);
      // {error:"""",message:""}
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      const response = await login(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (data, thunkAPI) => {
    try {
      const response = await update(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

let initialState = {
  user: null,
  token: null,
  error: null,
  loading: false,
  message: null,
  isAuthenticated: false,
  account_created: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      return (state = initialState);
    },
    resetAuthMessages: (state) => {
      state.error = null;
      state.message = null;
      state.account_created = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.error) {
          state.error = action.payload.error;
        } else {
          state.message = action.payload.msg;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.error) {
          state.error = action.payload.error;
        } else {
          state.user = action.payload.user;
          state.message = action.payload.message;
          state.token = action.payload.token;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.account_created = false;
        state.accounted_updated = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = false;
        if (action.payload.error) {
          state.error = action.payload.error;
        } else {
          state.user = action.payload.user;
          state.accounted_updated = true;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetAuthMessages } = authSlice.actions;

export default authSlice.reducer;
