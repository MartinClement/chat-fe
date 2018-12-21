import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Chat from 'components/Chat'

class App extends Component {
  _webSocket = false
  _connection = null

  componentWillMount = () => {
    this._webSocket = window.WebSocket || window.MozWebSocket

    if (this._webSocket) {
      this._connection = new this._webSocket('ws://127.0.01:1337')
    }
  }

  render() {
    return (
      <>
        {this._webSocket ? (
          <Chat connection={this._connection} />
        ) : (
          <div>Your brother does not support WebSocket</div>
        )}
      </>
    )
  }
}

export default App
