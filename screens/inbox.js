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

class Inbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInAs: this.props.navigation.state.params.loggedInAs,
      recipientTypedText: "",
      messageTypedText: "",
      recipient: "",
      outputMessage: [],
      receivedMessages: ""
    };
    this.socket = io.connect("http://localhost:3000");
    this.socket.emit("init-inbox", {
      handle: this.state.loggedInAs
    });
    this.socket.on("message", message => {
      this.setState({
        receivedMessages: message
      });
    });
  }

  setPrivateMessageRecipient(event) {
    this.setState({
      recipient: this.state.recipientTypedText
    });
  }

  sendPrivateMessage(event) {
    this.setState({
      outputMessage: this.state.messageTypedText
    });
    this.setState({
      sentMessage: this.state.messageTypedText
    });
    let sentMessage = this.state.messageTypedText;
    this.socket.emit(
      "private-message",
      this.state.recipient,
      this.state.loggedInAs,
      sentMessage
    );
  }

  render() {
    let colors = ["rgba(188,188,188,0.9)", "rgba(91, 91, 91, 0.9)"];
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Hello {this.state.loggedInAs}! Your Messages are as follows:
          </Text>
        </View>
        <View style={styles.inbound}>
          <FlatList
            keyExtractor={(item, index) => `${index}`}
            ref={ref => (this.flatList = ref)}
            onContentSizeChange={() =>
              this.flatList.scrollToEnd({ animated: true })
            }
            data={this.state.receivedMessages}
            renderItem={({ item, index }) => (
              <View
                style={{
                  borderRadius: 5,
                  borderWidth: 2,
                  margin: "1%",
                  height: 30,
                  backgroundColor: colors[index % colors.length]
                }}
              >
                <Text style={styles.text}>{item.key}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.recipient}>
          <Text style={styles.headerText}>Sending Message To:</Text>
          <Text style={styles.userSelectedText}>{this.state.recipient}</Text>
          <TextInput
            placeholder="Input a username"
            style={styles.input}
            onChangeText={text =>
              this.setState({
                recipientTypedText: text
              })
            }
            value={this.state.recipientTypedText}
          />
          <TouchableOpacity
            onPress={() => {
              this.setPrivateMessageRecipient();
            }}
            style={(styles.button, { backgroundColor: "#FFA500" })}
          >
            <Text style={styles.setButtonText}>SET</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.messageInput}>
          <TextInput
            placeholder="Input your message"
            style={styles.input}
            onChangeText={msg =>
              this.setState({
                messageTypedText: msg
              })
            }
            value={this.state.messageTypedText}
          />
          <TouchableOpacity
            onPress={() => {
              this.sendPrivateMessage();
            }}
            style={(styles.button, { backgroundColor: "#841584" })}
          >
            <Text style={styles.sendButtonText}>SEND</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  header: {
    marginTop: 5
  },
  inbound: {
    flex: 2,
    marginVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
    width: "80%",
    height: "90%"
  },
  messageInput: {
    flex: 1,
    marginVertical: 5
  },
  text: {
    fontSize: 20
  },
  recipient: {
    flex: 1,
    marginBottom: 6
  },
  headerText: {
    marginBottom: 2,
    fontSize: 20,
    textAlign: "center"
  },
  userSelectedText: {
    fontSize: 20,
    textAlign: "center",
    color: "red",
    minHeight: 30
  },
  button: {
    marginVertical: 5,
    minHeight: 40,
    maxHeight: 40,
    width: 250,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff"
  },
  sendButtonText: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20,
    paddingVertical: 6,
    color: "#FFA500"
  },
  setButtonText: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20,
    paddingVertical: 6,
    color: "#000"
  },
  input: {
    textAlign: "center",
    minHeight: 40,
    maxHeight: 40,
    width: 250,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff"
  }
});

export default Inbox;
