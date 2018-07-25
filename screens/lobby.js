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
  FlatList,
  Modal,
  TouchableHighlight
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
      chatHistory: [],
      userListModal: false,
      currentUsers: [],
      username: "",
      addFriend: [],
      friendsList: []
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
    this.socket.emit("init-inbox", {
      handle: this.state.loggedInAs
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

  navigateUserList() {
    this.props.navigation.navigate("Users", {
      loggedInAs: this.state.loggedInAs
    });
  }

  navigateInbox() {
    this.props.navigation.navigate("Inbox", {
      loggedInAs: this.state.loggedInAs
    });
  }

  handleAddFriend(event) {
    let test = this.state.friendsList;
    let buddyList = [];
    buddyList.push(test);
    friendName = this.state.addFriend;
    buddyList.push(friendName);
    this.setState({
      friendsList: buddyList
    });
  }

  displayCurrentUsers() {
    const store = this.state.currentUsers;
    const result = store.map(user => {
      let arr = user.handle;
      return arr;
    });
    this.setState({
      currentUsers: result
    });
    const joinResult = result.join(", ");
    return joinResult;
  }

  render() {
    let colors = ["rgba(188,188,188,0.9)", "rgba(91, 91, 91, 0.9)"];
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <ImageBackground
            source={require("../assets/images/whiteBG.jpg")}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={styles.menuArea}>
          <TouchableOpacity
            onPress={() => {
              this.navigateInbox();
            }}
          >
            <Text style={styles.menuButton}>INBOX</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.navigateUserList();
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
            returnKeyType="done"
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
                fontSize: 20,
                textAlign: "center",
                justifyContent: "center",
                marginTop: 6,
                color: "#FFA500"
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
  modal: {
    fontSize: 21,
    justifyContent: "center",
    alignItems: "center",
    color: "#FFA500",
    marginBottom: "1%"
  },
  friends: {
    color: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
    color: "#FFA500",
    marginBottom: "1%"
  },
  usersMenu: {
    flex: 1,
    flexDirection: "row",
    marginTop: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  usersOnlineArea: {
    flex: 4,
    borderRadius: 4,
    borderColor: "#fff",
    borderWidth: 1
  },
  friendsOnlineTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  friendsOnlineArea: {
    flex: 4,
    borderRadius: 4,
    borderColor: "#fff",
    borderWidth: 1
  },
  addFriendsArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "10%"
  },
  closeButton: {
    marginLeft: "5%",
    marginTop: "0.2%",
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    borderRadius: 4,
    borderColor: "#000",
    borderWidth: 1,
    maxHeight: "30%",
    maxWidth: "10%"
  },
  menuButton: {
    flex: 1,
    width: 110,
    fontSize: 20,
    minHeight: 40,
    maxHeight: 40,
    backgroundColor: "#FFA500",
    borderRadius: 3,
    borderWidth: 1,
    marginTop: 10,
    marginHorizontal: "2%",
    textAlign: "center",
    marginLeft: 10,
    paddingTop: 6
  },
  menuArea: {
    flex: 1,
    width: "81%",
    height: "100%",
    flexDirection: "row",
    marginVertical: "2%",
    marginTop: "2%",
    justifyContent: "center"
  },
  chatMessageArea: {
    fontSize: 20,
    minWidth: "100%",
    minHeight: "45%",
    margin: 3
  },
  chatBoxArea: {
    flex: 9,
    marginVertical: "2%",
    width: "91%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)"
  },
  inputBar: {
    flex: 1,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
    minWidth: "60%",
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "white",
    marginBottom: "4%"
  },
  sendArea: {
    flex: 1,
    justifyContent: "center"
  },
  sendButton: {
    flex: 1,
    minHeight: 40,
    maxHeight: 40,
    minWidth: "60%",
    alignSelf: "center",
    backgroundColor: "#841584",
    borderRadius: 3,
    borderWidth: 1,
    marginBottom: "5%"
  }
});

export default Lobby;
