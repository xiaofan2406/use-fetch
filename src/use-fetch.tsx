import React from 'react';

interface FetchState {
  isFetching: boolean;
  data: object | null;
  headers: object | null;
  error: object | null;
}

interface FetchStartAction {
  type: 'fetch_start';
}

interface FetchSuccessAction {
  type: 'fetch_success';
  data: object;
  headers: object;
}

interface FetchFailureAction {
  type: 'fetch_fail';
  error: object;
}

type FetchAction = FetchStartAction | FetchSuccessAction | FetchFailureAction;

type HeaderObject = Record<string, string>;

function convertHeadersToObject(headers: Headers) {
  const result: HeaderObject = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

const fetchReducer = (state: FetchState, action: FetchAction) => {
  switch (action.type) {
    case 'fetch_start':
      return {
        ...state,
        isFetching: true,
      };
    case 'fetch_success':
      return {
        ...state,
        isFetching: false,
        error: null,
        data: action.data,
        headers: action.headers,
      };
    case 'fetch_fail':
      return {
        ...state,
        isFetching: false,
        // should clear the data?
        error: action.error,
      };
    default:
      return state;
  }
};

export function useFetch(url: string, config?: RequestInit) {
  // skip state updates if the component unmount
  const shouldCancel = React.useRef(false);

  const [state, dispatch] = React.useReducer(fetchReducer, {
    isFetching: true, // true?
    data: null,
    headers: null,
    error: null,
  });

  React.useEffect(() => {
    const request = async () => {
      try {
        const result = await fetch(url, config);
        const data = await result.json();

        if (shouldCancel.current) return;

        dispatch({
          type: 'fetch_success',
          data,
          headers: convertHeadersToObject(result.headers),
        });
      } catch (error) {
        dispatch({
          type: 'fetch_fail',
          error,
        });
      }

      return () => {
        shouldCancel.current = true;
      };
    };

    request();
  }, [url, config, shouldCancel]); // config is an object -_-

  return state;
}
