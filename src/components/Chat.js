import React from 'react'
import styled from 'styled-components'
import { Spring, animated, interpolate } from 'react-spring'

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #424242;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 16px;
  color: #fff;
  font-family: Arial, sans-serif;

  & > * {
    padding: 10px;
    border: 3px solid #fff;
    border-radius: 3px;
  }
`

const Status = styled.div`
    color: ${p =>
      p.status === 'disconnected' ? 'red' : p.status === 'connection ...' ? 'orange' : 'green'}
    font-weight: 600;
    font-size: 18px;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    padding: 10px;
    border: 2px solid #fff;
    display: flex;
    background-color: #424242;
`

const Name = styled.div`
    color: ${p => p.color}
    font-size: 18px;
    margin-left: 5px;
`

const Messages = styled.div`
  flex-grow: 1;
  padding: 40px 0;
  overflow-y: scroll;
`

const Msg = styled(animated.div)`
  color: #fff;
  font-size: 16px;
  padding: 20px 0 20px 10px;
  display: flex;
  border-bottom: 1px solid #cfcfcf;
`

const Author = styled.div`
  color: ${p => p.color};
  font-size: 16px;
  font-weight: 600;
  margin-right: 10px;
`

const Input = styled.input`
  background-color: #424242;
  color: #fff;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  &:focus {
    outline: none;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    transition: all 5000s ease-in-out 0s;
  }
`
class Chat extends React.Component {
  _connection = null
  _input = React.createRef()
  _message = React.createRef()
  _MO = null

  state = {
    status: '',
    error: '',
    chatHistory: [],
    input: '',
    name: null,
    color: '',
  }

  scrollToBottom = () => {
    this._message.current.scrollTop = this._message.current.scrollHeight
  }

  componentWillMount = () => {
    const { connection } = this.props
    this._connection = connection
    this._connection.onopen = this.handleConnectionOpen
    this._connection.onerror = this.handleConnectionError
    this._connection.onmessage = this.handleConnectionMessage
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleSubmit)
    this._MO = new MutationObserver(this.scrollToBottom)
    this._MO.observe(this._message.current, { childList: true })
  }

  handleSubmit = e => {
    const v = this._input.current.value

    const { name } = this.state

    if (v !== '' && e.keyCode === 13) {
      this._connection.send(v)

      this.setState(prev => ({
        name: prev.name ? prev.name : v,
        input: '',
        status: 'connected',
      }))
    }
  }

  handleConnectionOpen = () => {
    this.setState({ status: 'connection ...' })
  }

  handleConnectionError = err => {
    console.log('connection error', err)
    this.setState({
      status: 'disconnected',
      error: 'Connection failed',
    })
  }

  handleConnectionMessage = msg => {
    let { chatHistory } = this.state

    try {
      var json = JSON.parse(msg.data)
    } catch (e) {
      console.log('Invalid JSON: ', msg.data)
      return
    }

    if (json.type === 'message') {
      chatHistory.push(json.data)
      this.setState({ chatHistory })
    } else {
      this.setState(prev => ({
        ...prev,
        [json.type]: json.data,
      }))
    }
  }

  handleInputChange = e => {
    this.setState({ input: e.target.value })
  }

  render() {
    const { name, chatHistory, color, input, status, error } = this.state
    return (
      <Wrapper>
        <Messages ref={this._message}>
          <Status status={status}>
            {status}
            {name && <Name color={color}>{`as : ${name}`}</Name>}
            {error !== '' && ` : ${error}`}
          </Status>
          {chatHistory.map(m => (
            <Spring from={{ x: -100 }} to={{ x: 0 }} config={{ tension: 280, friction: 20 }} native>
              {({ x }) => (
                <Msg
                  ref={m.id}
                  style={{ transform: interpolate(x, x => `translate3d(${x}%, 0, 0)`) }}
                >
                  <Author color={m.color}>{`${m.author} [${new Date(
                    m.time,
                  ).toLocaleTimeString()}] : `}</Author>
                  {m.text}
                </Msg>
              )}
            </Spring>
          ))}
        </Messages>
        <Input
          ref={this._input}
          type="text"
          value={input}
          onChange={e => this.handleInputChange(e)}
          placeholder={name ? 'Enter your name' : 'Your Message ...'}
        />
      </Wrapper>
    )
  }
}

export default Chat
