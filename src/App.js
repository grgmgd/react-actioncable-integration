import React from "react";
import { ActionCableProvider } from "react-actioncable-provider";
import network from "./utils/network";
import { accounts } from "./utils/constants";
import "./App.css";
import Chat from "./components/Chat";

const CABLE_URL = `ws://localhost:3000/cable?provider=admin&uid=${localStorage.getItem(
  "uid"
)}&token=${localStorage.getItem("token")}&client=${localStorage.getItem(
  "client"
)}`;

function App() {
  const onAuthenticateAdmin = () => {
    network({
      url: "http://localhost:3000/v1/admins/sign_in",
      method: "POST",
      data: { ...accounts.admin },
    }).then(({ headers }) => {
      localStorage.setItem("client", headers.client);
      localStorage.setItem("token", headers.token);
      localStorage.setItem("uid", headers.uid);
    });
  };

  const onAuthenticateAdmin2 = () => {
    network({
      url: "http://localhost:3000/v1/admins/sign_in",
      method: "POST",
      data: { ...accounts.admin2 },
    }).then(({ headers }) => {
      localStorage.setItem("client", headers.client);
      localStorage.setItem("token", headers.token);
      localStorage.setItem("uid", headers.uid);
    });
  };

  return (
    <ActionCableProvider url={CABLE_URL}>
      <div className="App">
        <header className="App-header">
          <button onClick={onAuthenticateAdmin}>Authenticate admin</button>
          <button onClick={onAuthenticateAdmin2}>Authenticate admin 2</button>

          <Chat />
        </header>
      </div>
    </ActionCableProvider>
  );
}

export default App;
