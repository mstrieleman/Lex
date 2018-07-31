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
const friendsList = [];
const blockList = [];

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInAs: this.props.navigation.state.params.loggedInAs,
      usersOnline: [],
      nameInput: "",
      userCheck: [],
      friendsList: [],
      blockList: [],
      friendAddStatus: null,
      userBlockStatus: null,
      modalVisible: false
    };
    this.socket = io.connect("http://localhost:3000");
    this.socket.emit("request-users", this.state.loggedInAs);
    this.socket.on("get-users", users => {
      this.setState({
        usersOnline: users
      });
    });
    this.socket.on("friend-check-success", user => {
      friendsList.push(user);
      this.setState({
        friendsList: friendsList
      });
      this.setState({
        friendAddStatus: true
      });
    });
    this.socket.on("user-not-found", status => {
      this.setState({
        friendAddStatus: false
      });
    });
    this.socket.on("user-successfully-blocked", user => {
      blockList.push(user);
      this.setState({
        blockList: blockList
      });
      this.setState({
        userBlockStatus: true
      });
    });
    this.socket.on("user-unsuccessfully-blocked", status => {
      this.setState({
        userBlockStatus: false
      });
    });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  creationCheck() {
    if (this.state.friendAddStatus === null) {
      return null;
    } else if (this.state.friendAddStatus === true) {
      return <Text style={{ color: "green" }}>Successfully added user!</Text>;
    } else if (this.state.friendAddStatus === false) {
      return <Text style={{ color: "red" }}>Failed to find user!</Text>;
    }
  }

  blockCheck() {
    if (this.state.userBlockStatus === null) {
      return null;
    } else if (this.state.userBlockStatus === true) {
      return <Text style={{ color: "green" }}>Successfully blocked user!</Text>;
    } else if (this.state.userBlockStatus === false) {
      return <Text style={{ color: "red" }}>Failed to find user!</Text>;
    }
  }

  addFriend(event) {
    this.setState({
      userCheck: this.state.nameInput
    });
    this.socket.emit("add-friend", this.state.userCheck);
  }

  blockUser(event) {
    this.setState({
      userCheck: this.state.nameInput
    });
    this.socket.emit("block-user", this.state.userCheck);
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
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View style={styles.background}>
            <ImageBackground
              source={require("../assets/images/whiteBG.jpg")}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={styles.modalContainer}>
            <View style={styles.top}>
              <Text style={styles.topText}>Users currently online</Text>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
                style={styles.redButton}
              >
                <Text style={styles.topButtonText}>CLOSE</Text>
              </TouchableHighlight>
            </View>
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
            <Text style={styles.textHeaders}>Blocked List</Text>
            <Text style={{ height: 20, marginBottom: 2 }}>
              {this.blockCheck()}
            </Text>
            <View style={styles.friendsList}>
              <FlatList
                keyExtractor={(item, index) => `${index}`}
                ref={ref => (this.flatList = ref)}
                onContentSizeChange={() =>
                  this.flatList.scrollToEnd({ animated: true })
                }
                data={this.state.blockList}
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
                  this.blockUser();
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
                  BLK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.top}>
          <Text style={styles.topText}>Users currently online</Text>
          <TouchableHighlight
            onPress={() => {
              this.setModalVisible(true);
            }}
            style={styles.redButton}
          >
            <Text style={styles.topButtonText}>BLOCK</Text>
          </TouchableHighlight>
        </View>
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
    marginBottom: 1
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
    marginTop: 1,
    minHeight: 40,
    maxHeight: 40,
    borderRadius: 3,
    borderWidth: 1,
    width: "20%"
  },
  redButton: {
    backgroundColor: "red",
    margin: 3,
    minHeight: 40,
    maxHeight: 40,
    borderRadius: 3,
    borderWidth: 1,
    width: "20%",
    marginRight: 10,
    marginTop: "3.4%"
  },
  top: {
    marginTop: "2%",
    marginRight: "4%",
    flex: 1,
    flexDirection: "row"
  },
  topText: {
    flexDirection: "row",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
    fontSize: 20
  },
  topButtonText: {
    flexDirection: "row",
    marginLeft: 8,
    marginRight: 5,
    fontSize: 20,
    marginTop: "7%",
    alignItems: "center",
    justifyContent: "center"
  },
  usersOnline: {
    flex: 4,
    width: "90%",
    borderRadius: 3,
    borderWidth: 1,
    margin: "1%",
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
    marginTop: 1
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    marginTop: 22
  }
});

export default Users;
