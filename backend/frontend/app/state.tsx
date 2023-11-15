import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  UID: string;
  loggedIn: boolean;
  admin: boolean;
};

type Action = {
  setLoggedIn: (loggedIn: State["loggedIn"]) => void;
  setUID: (uid: State["UID"]) => void;
  setAdmin: (admin: State["admin"]) => void;
};

export const UserState = create<State & Action>(
  persist(
    (set, get) => ({
      UID: "",
      loggedIn: false,
      setUID: (id) => set(() => ({ UID: id })),
      setLoggedIn: (loggedIn) => set(() => ({ loggedIn: loggedIn })),
      setAdmin: (admin) => set(() => ({ admin: admin })),
    }),
    {
      name: "auth",
    }
  )
);
