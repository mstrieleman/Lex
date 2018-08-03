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
import styles from "./styles.js";
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
      `${this.state.loggedInAs}: ${this.state.sentChatText}`,
      this.state.loggedInAs
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
        <View style={styles.smallSectionRow}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              this.navigateInbox();
            }}
          >
            <Text style={styles.blackText}>INBOX</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              this.navigateUserList();
            }}
          >
            <Text style={styles.blackText}>
              USERS: {this.state.currentUsers.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              this.handleLogout();
            }}
          >
            <Text style={styles.blackText}>LOG OUT</Text>
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
                <Text style={styles.generatedChatMessages}>{item.key}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
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
        <View style={styles.smallSection}>
          <TouchableOpacity
            style={styles.largePurpleButton}
            onPress={() => {
              this.sendMessage();
            }}
          >
            <Text style={styles.orangeText}>SEND</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Lobby;
