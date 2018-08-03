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
  TouchableHighlight
} from "react-native";
import io from "socket.io-client";
import styles from "./styles.js";
const onlineUsers = [];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      userCreated: null
    };
  }

  setModalVisible(visible) {
    this.setState({
      ModalUndecided: visible
    });
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
        <Text style={{ color: "#005aff", fontSize: 16 }}>
          User Created Success!
        </Text>
      );
    } else if (this.state.userCreated === false) {
      return (
        <Text style={{ color: "#ff2500", fontSize: 16 }}>
          Username already exists!
        </Text>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <ImageBackground
            source={require("../assets/images/whiteLG.jpg")}
            style={{ width: "100%", height: "100%", marginLeft: 7 }}
          />
        </View>
        <View style={styles.loginStatusNotification}>
          {this.userCreationCheck()}
          <TextInput
            style={styles.textInput}
            placeholder="Enter a username..."
            returnKeyType="done"
            onChangeText={text => this.setState({ username: text })}
          />
          <TouchableOpacity
            onPress={() => {
              this.handleSubmit();
            }}
            style={styles.largePurpleButton}
          >
            <Text style={styles.orangeText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Home;
