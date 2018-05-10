import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import io from 'socket.io-client';
const onlineUsers = [];

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
          this.props.navigation.navigate('Lobby', {
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
      return <Text style={{ color: '#FFA500' }}>Welcome!</Text>;
    } else if (this.state.userCreated === true) {
      return <Text style={{ color: '#005aff' }}>User Created Success!</Text>;
    } else if (this.state.userCreated === false) {
      return <Text style={{ color: '#ff2500' }}>Failed to Create User!</Text>;
    }
  }

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
      currentUsers: [],
      loggedInAs: [],
      displayUsers: []
    };
    this.socket = io.connect('http://localhost:3000');
    this.socket.emit('submit-handle', {
      handle: this.props.navigation.state.params.username
    });
    this.socket.on('join-lobby', onlineUsers => {
      this.setState({
        loggedInAs: this.props.navigation.state.params.username
      });
      this.setState({ currentUsers: onlineUsers });
    });
  }

  handleLogout() {
    this.socket.emit('log-out', this.state.loggedInAs);
    this.props.navigation.navigate('Home');
  }

  displayCurrentUsers() {
    const store = this.state.currentUsers;
    const result = store.map(user => {
      let arr = user.handle;
      return arr;
    });
    const joinResult = result.join(', ');
    return joinResult;
  }

  render() {
    console.log(this.displayCurrentUsers());
    return (
      <View style={styles.container}>
        <Text>Logged in as: {this.state.loggedInAs}</Text>
        <Text>Users online... {this.state.currentUsers.length}</Text>
        <Text>{this.displayCurrentUsers()}</Text>
        <Button
          onPress={() => {
            this.handleLogout();
          }}
          title="LOG OUT"
          color="#841584"
        />
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
