import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth, LoginStatus } from "../Login/authslice";
import { User, Note as UserNote } from "../../models";
import {
  selectNote,
  NoteStatus,
  fetchUserNote,
  updateUserNote,
  noteSlice,
} from "../Note/noteslice";
import { unwrapResult } from "@reduxjs/toolkit";

export function Note() {
  const auth = useAppSelector(selectAuth);
  const note = useAppSelector(selectNote);
  const dispatch = useAppDispatch();
  const [noteText, setNoteText] = useState("");

  const loadNote = async () => {
    console.log("inside Note", auth);
    if (
      auth.status === LoginStatus.LOGGED_IN &&
      note.fetchUserNoteStatus.status === NoteStatus.IDLE
    ) {
      const resultAction = await dispatch(
        fetchUserNote({ userId: auth.user.id, apiToken: auth.apiToken })
      );
      let result = unwrapResult(resultAction);
      console.log("result", result);
      setNoteText(result.text);
    }
  };

  useEffect(() => {
    loadNote();
  }, [auth.status]);

  useEffect(() => {
    // for auto persistence , use a time interval and clear it on mount
    const intervalId = setInterval(() => {
      // TODO: save note every 10 seconds or somehtin
    }, 10000);

    return () => clearInterval(intervalId); //This is important
  }, []);

  const saveNoteHandler = () => {
    if (
      auth.status === LoginStatus.LOGGED_IN &&
      note.updateUserNoteStatus.status !== NoteStatus.PENDING &&
      noteText !== note.userNote?.text
    ) {
      let note: UserNote = { userId: auth.user.id, text: noteText };
      dispatch(updateUserNote({ note, apiToken: auth.apiToken }));
    }
  };

  return (
    <div>
      {note.fetchUserNoteStatus.status === NoteStatus.PENDING && (
        <div>Loading user's note...</div>
      )}
      {note.fetchUserNoteStatus.status === NoteStatus.FAILED && (
        <>
          <div>An error occured fetching user's note...</div>
          <pre>{JSON.stringify(note.fetchUserNoteStatus.error, null, 2)}</pre>
        </>
      )}
      {note.fetchUserNoteStatus.status === NoteStatus.SUCCEEDED && (
        <>
          <textarea
            rows={10}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          ></textarea>
          <br />
          <button
            onClick={saveNoteHandler}
            disabled={
              note.updateUserNoteStatus.status === NoteStatus.PENDING ||
              noteText === note.userNote?.text
            }
          >
            Save
          </button>
          {note.updateUserNoteStatus.status === NoteStatus.FAILED && (
            <div style={{ color: "red" }}>
              {note.updateUserNoteStatus.error}
            </div>
          )}
          {note.updateUserNoteStatus.status === NoteStatus.SUCCEEDED && (
            <div style={{ color: "green" }}>Note Saved Successfully</div>
          )}
        </>
      )}

      <div style={{ textAlign: "left" }}>
        {/* <pre>{JSON.stringify(auth, null, 2)}</pre> */}
        <pre>{JSON.stringify(note, null, 2)}</pre>
      </div>
    </div>
  );
}
