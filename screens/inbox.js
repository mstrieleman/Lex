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
        <View style={{ marginTop: 5 }}>
          <Text style={styles.notableBlackText}>
            Hello {this.state.loggedInAs}! Your Messages are as follows:
          </Text>
        </View>
        <View style={styles.inboxChatArea}>
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
                  minHeight: 30,
                  backgroundColor: colors[index % colors.length]
                }}
              >
                <Text style={styles.blackText}>{item.key}</Text>
              </View>
            )}
          />
        </View>
        <View>
          <Text style={styles.notableBlackText}>Sending Message To:</Text>
          <Text style={styles.warningText}>{this.state.recipient}</Text>
          <TextInput
            placeholder="Input a username"
            style={styles.textInput}
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
            style={styles.largeOrangeButton}
          >
            <Text style={styles.notableBlackText}>SET</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginVertical: 5 }}>
          <TextInput
            placeholder="Input your message"
            style={styles.textInput}
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
            style={styles.largePurpleButton}
          >
            <Text style={styles.notableOrangeText}>SEND</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Inbox;
