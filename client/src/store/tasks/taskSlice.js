import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  total: 0,
  page: 1,
  pages: 0,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setPage: (state, { payload }) => {
      state.page = payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, { payload }) => {
      state.loading = false;
      state.error = payload || 'Request failed';
    };

    builder
      .addCase('tasks/fetchList/pending', pending)
      .addCase('tasks/fetchList/fulfilled', (state, { payload }) => {
        state.loading = false;
        state.tasks = payload.tasks;
        state.total = payload.total;
        state.page = payload.page;
        state.pages = payload.pages;
        state.error = null;
      })
      .addCase('tasks/fetchList/rejected', rejected)
      .addCase('tasks/create/pending', pending)
      .addCase('tasks/create/fulfilled', (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase('tasks/create/rejected', rejected)
      .addCase('tasks/updateStatus/pending', (state) => {
        state.error = null;
      })
      .addCase('tasks/updateStatus/fulfilled', (state, { payload }) => {
        const idx = state.tasks.findIndex((t) => t._id === payload._id);
        if (idx !== -1) state.tasks[idx] = payload;
        state.error = null;
      })
      .addCase('tasks/updateStatus/rejected', (state, { payload }) => {
        state.error = payload || 'Request failed';
      });
  },
});

export const { setPage, clearError } = taskSlice.actions;
export default taskSlice.reducer;
