import { IUser } from "@/models/user.model";
import { createSlice } from "@reduxjs/toolkit";

interface IIntialState {
  users: IUser[] | null;
  errors?: string | null;
}
const initialState: IIntialState = {
  users: null,
  errors: null,
};
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      state.errors = "";
    },
    updateUser: (state, action) => {
      const user = state.users?.find((user) => user._id === action.payload);
      if (user) {
        user.isVerified = true;
      }
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
  },
});

export const { setUsers, setErrors, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
