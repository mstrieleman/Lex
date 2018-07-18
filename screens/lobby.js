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
import io from "socket.io-client";

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
            source={require("../assets/images/blue.jpg")}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={styles.menuArea}>
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Text style={styles.menuButton}>
              USERS: {this.state.currentUsers.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.handleLogout();
            }}
          >
            <Text style={[styles.menuButton]}>LOG OUT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chatBoxArea}>
          <FlatList
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
                  borderRadius: 5,
                  borderWidth: 2,
                  margin: "1%"
                }}
              >
                <Text style={styles.chatMessageArea}>{item.key}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.inputArea}>
          <TextInput
            style={styles.inputBar}
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
        </View>
        <View style={styles.sendArea}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              this.sendMessage();
            }}
          >
            <Text
              style={{
                color: "#FFA500",
                fontSize: 22,
                fontWeight: "500",
                textAlign: "center",
                justifyContent: "center",
                top: "7.5%"
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

let colors = ["rgba(132, 132,0,0.20)", "rgba(54, 21, 132, 0.20)"];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  background: {
    height: "100%",
    width: "100%",
    position: "absolute"
  },
  menuArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: "2%"
  },
  menuButton: {
    flex: 1,
    width: 175,
    height: 70,
    fontSize: 22,
    fontWeight: "500",
    textAlign: "center",
    top: "18%",
    alignSelf: "center",
    color: "#841584",
    backgroundColor: "#FFA500",
    borderRadius: 3,
    borderWidth: 1,
    marginVertical: "3%",
    marginHorizontal: "2%"
  },
  chatMessageArea: {
    fontSize: 20,
    minWidth: "100%",
    color: "white"
  },
  chatBoxArea: {
    flex: 9,
    marginVertical: "1%",
    width: "91%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)"
  },
  inputArea: {
    flex: 1,
    width: "81%",
    marginVertical: "2%",
    marginTop: "1%"
  },
  inputBar: {
    flex: 1,
    fontSize: 20,
    borderRadius: 4,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "white",
    marginTop: "2%"
  },
  sendArea: {
    flex: 1,
    width: "81%",
    justifyContent: "center"
  },
  sendButton: {
    flex: 1,
    height: 70,
    width: "81%",
    alignSelf: "center",
    backgroundColor: "#841584",
    borderRadius: 3,
    borderWidth: 1,
    marginBottom: "5%"
  }
});

export default Lobby;
