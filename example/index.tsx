import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { useFetch } from '../src';

const App = () => {
  const result = useFetch('https://jsonplaceholder.typicode.com/todos/1');
  console.log(result);
  return (
    <div>
      <pre>{JSON.stringify(result)}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
