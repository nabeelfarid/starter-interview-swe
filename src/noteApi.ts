// TODO: Move all api calls from thunks over here , maybe use axios instance with base url from .env
// and http interceptors for catching generic errors and use a toast to notify user

import { Note } from "./models";

const fetchUserNote = (userId: string, apitoken: string): Promise<Note> => {
  return Promise.resolve({ userId: userId, text: "users note" });
};

const NoteApi = {
  fetchUserNote,
};
export default NoteApi;
