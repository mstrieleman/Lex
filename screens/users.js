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
import styles from "./styles.js";
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
            <View style={styles.smallSectionRow}>
              <Text style={styles.notableBlackText}>
                Users currently online
              </Text>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
                style={styles.smallRedButton}
              >
                <Text style={styles.blockButtonText}>CLOSE</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.listUsersArea}>
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
            <Text style={styles.notableBlackText}>Blocked List</Text>
            <Text style={{ height: 20, marginBottom: 2 }}>
              {this.blockCheck()}
            </Text>
            <View style={styles.listUsersArea}>
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
            <View style={styles.smallSectionRow}>
              <TextInput
                style={styles.textInput}
                returnKeyType="done"
                autoCorrect={false}
                placeholder="Block username here..."
                clearButtonMode="always"
                onChangeText={text =>
                  this.setState({
                    nameInput: text
                  })
                }
                value={this.state.nameInput}
              />
              <TouchableOpacity
                style={styles.smallPurpleButton}
                onPress={() => {
                  this.blockUser();
                }}
              >
                <Text style={styles.orangeText}>BLK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.smallSectionRow}>
          <Text style={styles.notableBlackText}>Users currently online</Text>
          <TouchableHighlight
            onPress={() => {
              this.setModalVisible(true);
            }}
            style={styles.smallRedButton}
          >
            <Text style={styles.blockButtonText}>BLOCK</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.listUsersArea}>
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
        <Text style={styles.notableBlackText}>Friends List</Text>
        <Text style={{ height: 20 }}>{this.creationCheck()}</Text>
        <View style={styles.listUsersArea}>
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
        <View style={styles.largeSection}>
          <TextInput
            style={styles.textInput}
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
            style={styles.smallPurpleButton}
            onPress={() => {
              this.addFriend();
            }}
          >
            <Text style={styles.orangeText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Users;
