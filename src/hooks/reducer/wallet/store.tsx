import { useReducer, useEffect } from "react";
// import { useEthers } from "@usedapp/core";
import moment from "moment";
//
import storage from "../../storage";
//
import reducer, { initialState, actionTypes } from "./reducer";
//
export default () => {
  // const { deactivate } = useEthers();
  const deactivate = () => {};

  const [sessionStorageState, setSessionStorageState] =
    storage.useSessionStorage("sessionWallet", initialState);

  const [state, dispatch] = useReducer(
    (state: any, action: any) => {
      const newState = reducer(state, action);
      setSessionStorageState(newState);
      return newState;
    },
    { ...sessionStorageState }
  );

  const actions = {
    setWalletAddress: ({ walletAddress }: any) => {
      dispatch({
        type: actionTypes.SET_WALLET_ADDRESS,
        payload: {
          walletAddress,
          timeout: moment().subtract(15, "minutes").unix(),
        },
      });
    },
    unsetWalletAddress: () => {
      dispatch({
        type: actionTypes.SET_WALLET_ADDRESS,
        payload: {
          walletAddress: null,
          timeout: null,
        },
      });
    },
  };

  const _handleInActivateWallet = () => {
    actions.unsetWalletAddress();
    deactivate();
  };

  const _handleCheckExpired = () => {
    const { walletAddress, timeout } = Object(state);
    if (walletAddress) {
      if (timeout === moment().unix()) {
        _handleInActivateWallet();
      }
    }
  };

  useEffect(() => {
    _handleCheckExpired();
    return () => {};
  }, []);

  return [state, actions];
};
