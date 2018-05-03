import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView
} from 'react-native';
import SocketIOClient from 'socket.io-client/dist/socket.io';
const socket = SocketIOClient('http://localhost:3000');
import { StackNavigator } from 'react-navigation';
const onlineUsers = [];
const recentUserJoin = [];

socket.on('users', data => {
  onlineUsers.push(data.join(', '));
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      userCreated: null
    };
  }
  handleSubmit() {
    const url = 'http://localhost:3000/login';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username
      })
    })
      .then(response => {
        if (response.status === 200) {
          this.setState({ userCreated: true });
          this.props.navigation.navigate('Lobby');
          return response;
        } else {
          this.setState({ userCreated: false });
          return response;
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  userCreationCheck() {
    if (this.state.userCreated === null) {
      return <Text style={{ color: '#FFA500' }}>Welcome!</Text>;
    } else if (this.state.userCreated === true) {
      return <Text style={{ color: '#005aff' }}>User Created Success!</Text>;
    } else if (this.state.userCreated === false) {
      return <Text style={{ color: '#ff2500' }}>Failed to Create User!</Text>;
    }
  }

  currentUserChange() {}

  render() {
    return (
      <View style={styles.container}>
        {this.userCreationCheck()}
        <TextInput
          style={styles.input}
          placeholder="Enter a username..."
          returnKeyType="done"
          onChangeText={text => this.setState({ username: text })}
        />
        <Button
          onPress={() => {
            this.handleSubmit();
          }}
          title="LOGIN"
          color="#841584"
        />
      </View>
    );
  }
}

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsers: onlineUsers
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Users online...</Text>
        <ScrollView style={{ height: 400 }}>
          {this.state.currentUsers.map(m => {
            return (
              <Text key={m} style={{ margin: 10 }}>
                {m}
              </Text>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: Home
    },
    Lobby: {
      screen: Lobby
    }
  },
  {
    initialRouteName: 'Home'
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: 175,
    margin: 20,
    marginBottom: 0,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16
  }
});
