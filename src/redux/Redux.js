import React, { useReducer, useContext, createContext } from "react";

const initialState = {
  token: "",
  expired: true,
  loading: true,
  user: [],
  stream: [],
  liked_stream: [],
  unlike_strems: [],
  comment: [],
  notifications: [],
  comToggle: { toggle: false, streamId: "" },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "Add token":
      return { ...state, token: action.value };

    case "validateToken":
      return { ...state, expired: action.value };

    case "Add userData":
      return { ...state, user: action.value };

    case "Set loading":
      return { ...state, loading: action.value };

    case "Get stream":
      return { ...state, stream: action.value };

    case "Like stream":
      return { ...state, liked_stream: action.value };

    case "unLike stream":
      return { ...state, unlike_stream: action.value };

    case "update likes":
      return { ...state, liked_stream: [...state.liked_stream, action.value] };

    case "remove likes":
      return { ...state, liked_stream: action.value };

    case "Comment":
      return { ...state, comment: action.value };

    case "notification":
      return { ...state, notifications: action.value };

    case "comtoggle":
      return { ...state, comToggle: action.value };

    default:
      return initialState;
  }
};

const Colorful = createContext();
export function useRedux() {
  return useContext(Colorful);
}

const initialState2 = {
  comment: [],
};

const reducer2 = (state, action) => {
  switch (action.type) {
    case "comtoggle":
      return { ...state, comToggle: action.value };
  }
};

const Colorful2 = createContext();
export function useRedux2() {
  return useContext(Colorful2);
}

function Redux({ children }) {
  return (
    <>
      <Colorful.Provider value={useReducer(reducer, initialState)}>
        <Colorful2.Provider value={useReducer(reducer2, initialState2)}>
          {children}
        </Colorful2.Provider>
      </Colorful.Provider>
    </>
  );
}

export default Redux;
