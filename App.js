import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList
} from "react-native";
import SvgUri from "react-native-svg-uri";
import { StackNavigator } from "react-navigation";
import io from "socket.io-client";
const onlineUsers = [];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      userCreated: null
    };
  }

  handleSubmit() {
    const url = "http://localhost:3000/login";
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username
      })
    })
      .then(response => {
        if (response.status === 200) {
          this.setState({ userCreated: true });
          this.props.navigation.navigate("Lobby", {
            username: this.state.username
          });
        } else {
          this.setState({ userCreated: false });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  userCreationCheck() {
    if (this.state.userCreated === null) {
      return <Text style={{ fontSize: 20 }} />;
    } else if (this.state.userCreated === true) {
      return (
        <Text style={{ color: "#005aff", fontSize: 20 }}>
          User Created Success!
        </Text>
      );
    } else if (this.state.userCreated === false) {
      return (
        <Text style={{ color: "#ff2500", fontSize: 20 }}>
          Failed to Create User!
        </Text>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.image}>
          <ImageBackground
            source={require("../lex/assets/images/logo.png")}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View>
          <SvgUri
            width="200"
            height="200"
            source={require("../lex/assets/svg/logo.svg")}
          />
        </View>
        <View style={styles.login}>
          {this.userCreationCheck()}
          <TextInput
            style={styles.loginInput}
            placeholder="Enter a username..."
            returnKeyType="done"
            onChangeText={text => this.setState({ username: text })}
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              this.handleSubmit();
            }}
          >
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsers: [],
      loggedInAs: [],
      displayUsers: [],
      sentChatText: "",
      chatHistory: []
    };
    this.socket = io.connect("http://localhost:3000");
    this.socket.emit("submit-handle", {
      handle: this.props.navigation.state.params.username
    });
    this.socket.on("join-lobby", onlineUsers => {
      this.setState({
        loggedInAs: this.props.navigation.state.params.username
      });
      this.setState({ currentUsers: onlineUsers });
    });
    this.socket.on("server-send-message", messages => {
      this.setState({
        chatHistory: messages
      });
    });
  }

  sendMessage(event) {
    this.socket.emit(
      "client-send-message",
      `${this.state.loggedInAs}: ${this.state.sentChatText}`
    );
    this.setState({
      sentChatText: ""
    });
  }

  handleLogout() {
    this.socket.emit("log-out", this.state.loggedInAs);
    this.props.navigation.navigate("Home");
  }

  displayCurrentUsers() {
    const store = this.state.currentUsers;
    const result = store.map(user => {
      let arr = user.handle;
      return arr;
    });
    const joinResult = result.join(", ");
    return joinResult;
  }

  render() {
    let colors = ["rgba(132,132,0,0.20)", "rgba(54, 21, 132, 0.20)"];
    return (
      <View style={styles.container}>
        <View style={styles.image}>
          <ImageBackground
            source={require("../lex/assets/images/blue.jpg")}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={styles.logoutButton}>
          <TouchableOpacity
            onPress={() => {
              this.handleLogout();
            }}
          >
            <Text style={{ color: "#841584", marginTop: "2%" }}>LOG OUT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.upperContainer}>
          <Text
            style={{ fontWeight: "bold", color: "white", marginBottom: "2%" }}
          >
            Users online: {this.state.currentUsers.length}
          </Text>
          <ScrollView>
            <Text style={{ fontWeight: "bold", color: "white" }}>
              {this.displayCurrentUsers()}
            </Text>
          </ScrollView>
        </View>
        <FlatList
          style={styles.bubble}
          keyExtractor={(item, index) => `${index}`}
          ref={ref => (this.flatList = ref)}
          onContentSizeChange={() =>
            this.flatList.scrollToEnd({ animated: true })
          }
          data={this.state.chatHistory}
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor: colors[index % colors.length],
                borderRadius: 4,
                borderWidth: 1,
                margin: "1%"
              }}
            >
              <Text style={styles.chatBubble}>{item.key}</Text>
            </View>
          )}
        />
        <View>
          <TextInput
            style={styles.chatInput}
            autoCorrect={false}
            placeholder="Type your messages here..."
            clearButtonMode="always"
            onChangeText={text =>
              this.setState({
                sentChatText: text
              })
            }
            value={this.state.sentChatText}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              this.sendMessage();
            }}
          >
            <Text
              style={{
                color: "#FFA500",
                fontWeight: "bold",
                marginBottom: "2%"
              }}
            >
              SEND
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  login: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    marginTop: "60%"
  },
  image: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  logoutButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFA500",
    borderColor: "#000",
    width: 250,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: "2%"
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#841584",
    borderColor: "#000",
    width: 250,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1
  },
  loginInput: {
    width: 250,
    margin: 20,
    marginBottom: 15,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
    backgroundColor: "white"
  },
  sendButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#841584",
    borderColor: "#000",
    width: 250,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    marginLeft: "9%",
    marginBottom: "2%"
  },
  chatInput: {
    width: 300,
    margin: 10,
    marginTop: "3%",
    height: 45,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 20,
    backgroundColor: "white"
  },
  upperContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    maxHeight: "15%",
    marginTop: "2%",
    width: "90%"
  },
  chatWindow: {
    flex: 1,
    backgroundColor: "white",
    height: "60%",
    width: "90%",
    marginTop: "5%"
  },
  chatBubble: {
    flex: 2,
    justifyContent: "space-between",
    minWidth: "90%",
    maxWidth: "90%",
    overflow: "scroll",
    flexWrap: "wrap",
    color: "white",
    fontSize: 20
  }
});
