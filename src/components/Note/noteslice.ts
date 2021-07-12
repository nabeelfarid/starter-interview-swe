import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User, Note } from "../../models";

export enum NoteStatus {
  IDLE = "IDLE",
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
}

export type NoteState = {
  userNote?: Note;
  fetchUserNoteStatus: { status: NoteStatus; error?: string };
  updateUserNoteStatus: { status: NoteStatus; error?: string };
};

const initialState: NoteState = {
  fetchUserNoteStatus: { status: NoteStatus.IDLE },
  updateUserNoteStatus: { status: NoteStatus.IDLE },
};

export const updateUserNote = createAsyncThunk(
  "note/updateUserNote",
  async ({ note, apiToken }: { note: Note; apiToken: string }) => {
    await fetch(
      `https://60b793ec17d1dc0017b8a6bc.mockapi.io/users/${note.userId}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: apiToken ? `Bearer ${apiToken}` : "",
        },
        body: JSON.stringify({
          note: note.text,
        }),
      }
    );
    return note;
  }
);

export const fetchUserNote = createAsyncThunk(
  "note/fetchUserNote",
  async ({ userId, apiToken }: { userId: string; apiToken: string }) => {
    console.log("Inside thunk note/fetchUserNote : ", userId, apiToken);

    const response = await fetch(
      `https://60b793ec17d1dc0017b8a6bc.mockapi.io/users/${userId}`,
      {
        headers: {
          "content-type": "application/json",
          authorization: apiToken ? `Bearer ${apiToken}` : "",
        },
      }
    );
    const data = await response.json();

    return { userId: data.id, text: data.note } as Note;
  }
);

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    resetNoteSlice: (state) => {
      state.fetchUserNoteStatus.status = NoteStatus.IDLE;
      state.fetchUserNoteStatus.error = undefined;
      state.updateUserNoteStatus.status = NoteStatus.IDLE;
      state.updateUserNoteStatus.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchUserNote.fulfilled,
        (state, action: PayloadAction<Note>) => {
          console.log("Inside fetchUserNote.fulfilled : ", state, action);
          state.fetchUserNoteStatus.status = NoteStatus.SUCCEEDED;
          state.userNote = action.payload;
        }
      )
      .addCase(fetchUserNote.rejected, (state, action) => {
        console.log("Inside fetchUserNote.rejected : ", action);
        state.fetchUserNoteStatus.status = NoteStatus.FAILED;
        state.fetchUserNoteStatus.error =
          "fetchUserNote failed. See console for details.";
      })
      .addCase(fetchUserNote.pending, (state, action) => {
        console.log("Inside fetchUserNote.pending : ", action);
        state.fetchUserNoteStatus.status = NoteStatus.PENDING;
      })
      .addCase(
        updateUserNote.fulfilled,
        (state, action: PayloadAction<Note>) => {
          console.log("Inside updateUserNote.fulfilled : ", action);
          state.updateUserNoteStatus.status = NoteStatus.SUCCEEDED;
          state.userNote = action.payload;
        }
      )
      .addCase(updateUserNote.rejected, (state, action) => {
        console.log("Inside updateUserNote.rejected : ", action);
        state.updateUserNoteStatus.status = NoteStatus.FAILED;
        state.updateUserNoteStatus.error =
          "updateUserNote failed. See console for details.";
      })
      .addCase(updateUserNote.pending, (state, action) => {
        console.log("Inside updateUserNote.pending : ", action);
        state.updateUserNoteStatus.status = NoteStatus.PENDING;
      });
  },
});

export const { resetNoteSlice } = noteSlice.actions;

export const selectNote = (state: RootState) => state.note;

export default noteSlice.reducer;
