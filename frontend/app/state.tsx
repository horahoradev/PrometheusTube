import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const userState = create(
  persist(
    (set, get) => ({
      loggedIn: false,
      setLoggedIn: set({ loggedIn: true }),
      uid: 0,
      setUserID: (uid) =>
        set(() => ({
          uid: uid,
        })),
    }),
    {
      name: "auth", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
