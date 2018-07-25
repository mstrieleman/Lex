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
  Modal,
  TouchableHighlight,
  FlatList
} from "react-native";
import io from "socket.io-client";
const list = [];

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInAs: this.props.navigation.state.params.loggedInAs,
      usersOnline: [],
      nameInput: "",
      friendCheck: [],
      friendsList: [],
      friendAddStatus: null
    };
    this.socket = io.connect("http://localhost:3000");
    this.socket.emit("request-users", this.state.loggedInAs);
    this.socket.on("get-users", users => {
      this.setState({
        usersOnline: users
      });
    });
    this.socket.on("friend-check-success", user => {
      list.push(user);
      this.setState({
        friendsList: list
      });
      this.setState({
        friendAddStatus: true
      });
    });
    this.socket.on("user-not-found", user => {
      console.log("triggered");
      this.setState({
        friendAddStatus: false
      });
    });
  }

  creationCheck() {
    if (this.state.friendAddStatus === null) {
      return null;
    } else if (this.state.friendAddStatus === true) {
      return <Text style={{ color: "green" }}>Successfully added user!</Text>;
    } else if (this.state.friendAddStatus === false) {
      return <Text style={{ color: "red" }}>Failed to add user!</Text>;
    }
  }

  addFriend(event) {
    this.setState({
      friendCheck: this.state.nameInput
    });
    this.socket.emit("add-friend", this.state.friendCheck);
  }

  render() {
    let userColors = ["rgba(188,188,188,0.9)", "rgba(91, 91, 91, 0.9)"];
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <ImageBackground
            source={require("../assets/images/whiteBG.jpg")}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <Text style={styles.textHeaders}>Users currently online</Text>
        <View style={styles.usersOnline}>
          <FlatList
            keyExtractor={(item, index) => `${index}`}
            ref={ref => (this.flatList = ref)}
            onContentSizeChange={() =>
              this.flatList.scrollToEnd({ animated: true })
            }
            data={this.state.usersOnline}
            renderItem={({ item, index }) => (
              <View
                style={{
                  backgroundColor: userColors[index % userColors.length],
                  borderRadius: 5,
                  borderWidth: 2,
                  margin: "1%"
                }}
              >
                {" "}
                <Text style={{ fontSize: 20 }}>{item.handle}</Text>
              </View>
            )}
          />
        </View>
        <Text style={styles.textHeaders}>Friends List</Text>
        <Text style={{ height: 20, marginBottom: 2 }}>
          {this.creationCheck()}
        </Text>
        <View style={styles.friendsList}>
          <FlatList
            keyExtractor={(item, index) => `${index}`}
            ref={ref => (this.flatList = ref)}
            onContentSizeChange={() =>
              this.flatList.scrollToEnd({ animated: true })
            }
            data={this.state.friendsList}
            renderItem={({ item, index }) => (
              <View
                style={{
                  backgroundColor: userColors[index % userColors.length],
                  borderRadius: 5,
                  borderWidth: 2,
                  margin: "1%"
                }}
              >
                {" "}
                <Text style={{ fontSize: 20 }}>{item}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.addFriend}>
          <TextInput
            style={styles.input}
            returnKeyType="done"
            autoCorrect={false}
            placeholder="Add friend name here..."
            clearButtonMode="always"
            onChangeText={text =>
              this.setState({
                nameInput: text
              })
            }
            value={this.state.nameInput}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.addFriend();
            }}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                justifyContent: "center",
                marginTop: "9%",
                color: "#FFA500"
              }}
            >
              ADD
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
    justifyContent: "space-between",
    height: "100%"
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },

  textHeaders: {
    textAlign: "center",
    marginTop: "2%",
    fontSize: 20,
    marginBottom: 2
  },
  input: {
    fontSize: 16,
    borderRadius: 3,
    borderWidth: 1,
    minHeight: 40,
    maxHeight: 40,
    width: "60%",
    backgroundColor: "white",
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: "#841584",
    margin: 3,
    minHeight: 40,
    maxHeight: 40,
    borderRadius: 3,
    borderWidth: 1,
    width: "20%"
  },
  usersOnline: {
    flex: 4,
    width: "90%",
    borderRadius: 3,
    borderWidth: 1,
    margin: "2%",
    marginTop: "2%"
  },
  friendsList: {
    flex: 4,
    width: "90%",
    maxHeight: "90%",
    borderRadius: 3,
    borderWidth: 1,
    margin: "1%",
    marginBottom: 1
  },
  addFriend: {
    flex: 1,
    width: "90%",
    height: "55%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 1
  }
});

export default Users;
