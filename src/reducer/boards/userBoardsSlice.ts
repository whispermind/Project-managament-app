import { BoardGetRequest } from './../../API/boards';
import { RootState } from '../../app/store';
import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import {
  IBoard,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  BoardUpdateRequest,
  BoardDeleteRequest,
  BoardCreateRequest
} from '../../API/boards';
import { SerializedError } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import applyToken from '../../API/applyToken';

export interface UserBoardsState {
  boards: IBoard[];
  boardsLoading: boolean;
  boardsError: string;
  activeBoardId: string;
}

export interface BoardRequestData {
  id?: string;
}

const initialState: UserBoardsState = {
  boards: [],
  boardsLoading: false,
  boardsError: '',
  activeBoardId: ''
};

export const deleteBoardThunk = createAsyncThunk(
  'boards/deleteBoard',
  async ({ id }: Omit<BoardDeleteRequest, 'token'>, { dispatch, getState, rejectWithValue }) => {
    try {
      await applyToken<BoardDeleteRequest, ReturnType<typeof deleteBoard>>(
        deleteBoard,
        {
          token: '',
          id
        },
        getState() as RootState
      );
      dispatch(getBoardThunk({}));
    } catch {
      rejectWithValue(`Board can't be deleted`);
    }
  }
);

export const updateBoardThunk = createAsyncThunk(
  'boards/updateBoard',
  async (
    { title, id }: Omit<BoardUpdateRequest, 'token'>,
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      await applyToken<BoardUpdateRequest, ReturnType<typeof updateBoard>>(
        updateBoard,
        {
          token: '',
          title,
          id
        },
        getState() as RootState
      );
      dispatch(getBoardThunk({}));
    } catch {
      rejectWithValue(`Board can't be updated`);
    }
  }
);

export const getBoardThunk = createAsyncThunk(
  'boards/getBoard',
  async ({ id }: BoardRequestData, { rejectWithValue, getState }) => {
    try {
      return await applyToken<BoardGetRequest, ReturnType<typeof getBoard>>(
        getBoard,
        {
          token: '',
          id
        },
        getState() as RootState
      );
    } catch {
      rejectWithValue(`Boards can't be loaded`);
    }
  }
);

export const createBoardThunk = createAsyncThunk(
  'boards/createBoard',
  async ({ title }: Omit<BoardCreateRequest, 'token'>, { dispatch, getState, rejectWithValue }) => {
    try {
      await applyToken<BoardCreateRequest, ReturnType<typeof createBoard>>(
        createBoard,
        {
          token: '',
          title
        },
        getState() as RootState
      );
      dispatch(getBoardThunk({}));
    } catch {
      rejectWithValue(`Board can't be created`);
    }
  }
);

export const setUserActiveBoard = createAction('setActiveBoard', (id: string) => {
  return {
    payload: {
      id
    }
  };
});

export const userBoardsSlice = createSlice({
  name: 'userBoards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createBoardThunk.rejected, setBoardError);

    builder.addCase(updateBoardThunk.rejected, setBoardError);

    builder.addCase(deleteBoardThunk.rejected, setBoardError);

    builder
      .addCase(getBoardThunk.pending, (state) => {
        state.boardsLoading = true;
      })
      .addCase(getBoardThunk.fulfilled, (state, { payload }) => {
        state.boards = payload as IBoard[];
        state.boardsLoading = false;
        state.boardsError = '';
      })
      .addCase(getBoardThunk.rejected, (state, { error }) => {
        state.boardsLoading = false;
        state.boardsError = error.message as string;
      });

    builder.addCase(setUserActiveBoard, (state, { payload }) => {
      state.activeBoardId = payload.id;
    });
  }
});

function setBoardError(
  state: WritableDraft<UserBoardsState>,
  { error }: { error: SerializedError }
) {
  state.boardsError = error.message as string;
}

export const getAppBoards = (state: RootState) => state.userBoards.boards;
export const getAppBoardsError = (state: RootState) => state.userBoards.boardsError;
export const getAppBoardsLoading = (state: RootState) => state.userBoards.boardsLoading;
export const getAppBoardsActiveId = (state: RootState) => state.userBoards.activeBoardId;

export default userBoardsSlice.reducer;
