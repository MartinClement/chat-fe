import React, { Component } from 'react'
import './App.css'
import Chat from 'components/Chat'

const WEB_SOCKET_URL = 'ws://127.0.0.1:1337'

class App extends Component {
  _webSocket = false
  _connection = null

  componentWillMount = () => {
    this._webSocket = window.WebSocket || window.MozWebSocket

    if (this._webSocket) {
      this._connection = new this._webSocket(WEB_SOCKET_URL)
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
