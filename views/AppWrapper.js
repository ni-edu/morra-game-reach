import React from "react";

export const AppWrapper = ({ children }) => (
  <div className="App">
    <header className="App-header" id="root">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Tipi_Napoletani_-_Il_Giuoco_della_Morra_%28Boys_playing_%22Morra%22%29_-_Old_postcard.jpg"
        alt="Morra Game"
        width="500"
        height="250"
      />
      <h1>Morra game</h1>
      {children}
    </header>
  </div>
);
