import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  UID: string;
  loggedIn: boolean;
};

type Action = {
  setLoggedIn: (loggedIn: State["loggedIn"]) => void;
  setUID: (lastName: State["UID"]) => void;
};

export const UserState = create<State & Action>(
  persist(
    (set, get) => ({
      UID: "",
      loggedIn: false,
      setUID: (id) => set(() => ({ UID: id })),
      setLoggedIn: (loggedIn) => set(() => ({ loggedIn: loggedIn })),
    }),
    {
      name: "auth",
    }
  )
);
