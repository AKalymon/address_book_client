import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/app"

/**
 * This is how we initially render the <App/> react component into the index.html <DIV> and specifically target 'root' element
 */
ReactDOM.render(<App/>, document.getElementById("root"));
