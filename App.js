import React from "react";
import { StackNavigator } from "react-navigation";
import Home from "./screens/home.js";
import Lobby from "./screens/lobby.js";
import Users from "./screens/users.js";
import Inbox from "./screens/inbox.js";

const RootStack = StackNavigator(
  {
    Home: {
      screen: Home
    },
    Lobby: {
      screen: Lobby
    },
    Users: {
      screen: Users
    },
    Inbox: {
      screen: Inbox
    }
  },
  {
    initialRouteName: "Home"
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
