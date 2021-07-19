import React, { useReducer, useEffect } from "react";
//
import { store as walletStore } from "../reducer/wallet";
//
const AppStoreContext = React.createContext(null);

const AppStoreProvider = (props: any) => {
  //
  const [walletState, walletActions] = walletStore();
  //
  return (
    <AppStoreContext.Provider
      value={Object({
        walletState: walletState,
        walletActions: walletActions,
      })}
    >
      {props.children}
    </AppStoreContext.Provider>
  );
};

export { AppStoreProvider, AppStoreContext };
