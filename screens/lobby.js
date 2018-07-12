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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
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
    marginTop: "2%",
    margin: 1
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
    marginBottom: "2%",
    margin: 1
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
    width: "90%",
    margin: 1
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

export default Lobby;
