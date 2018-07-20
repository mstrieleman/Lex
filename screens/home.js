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
    justifyContent: "flex-end",
    width: 200,
    margin: 1,
    marginBottom: "14%"
  },
  background: {
    flex: 1,
    backgroundColor: "#FCFCFB",
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
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
  }
});

export default Home;
