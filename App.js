import React from "react";
import { StackNavigator } from "react-navigation";
import Home from "./screens/home.js";
import Lobby from "./screens/lobby.js";

const RootStack = StackNavigator(
  {
    Home: {
      screen: Home
    },
    Lobby: {
      screen: Lobby
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
