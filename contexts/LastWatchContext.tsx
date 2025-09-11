import { createContext } from "react";

export const LastWatchContext = createContext<{lastWatchUpdater: any, setLastWatchUpdater:any}>({lastWatchUpdater: -1, setLastWatchUpdater: ()=>{}});