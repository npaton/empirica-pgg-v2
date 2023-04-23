import React from "react";
import { Avatar } from "./AnimalAvatar";

export class Chat extends React.Component {
  state = { open: false, focused: false, text: "" };

  constructor(props) {
    super(props);

    this.messagesRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.messagesRef.current) {
      return;
    }

    if (
      (!prevState.open && this.state.open) ||
      (!prevState.focused && this.state.focused)
    ) {
      this.messagesRef.current.scrollTop =
        this.messagesRef.current.scrollHeight;
    }
    if (prevProps.messages.length !== this.props.messages.length) {
      this.messagesRef.current.scrollTop =
        this.messagesRef.current.scrollHeight;
    }
  }

  clearTimeout = () => {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  };

  handleMouseEnterOpen = () => {
    this.clearTimeout();
  };

  handleMouseLeaveOpen = () => {
    this.closeTimeout = setTimeout(() => {
      this.setState({ open: false });
    }, 1000);
  };

  render() {
    const { messages, avatar } = this.props;
    const { text } = this.state;
    const isOpen = this.state.open || this.state.focused;

    return (
      <div
        className={
          isOpen
            ? "absolute w-full h-full px-2 py-2 pointer-events-auto flex flex-col justify-end"
            : "absolute bottom-0 w-full font-mono pointer-events-auto"
        }
      >
        <div
          className={
            isOpen
              ? "rounded-2xl outline outline-2 outline-gray-300 pb-2 max-h-[75%] flex flex-col font-mono bg-white/95"
              : "pb-4 pl-4 w-full font-mono"
          }
        >
          {!isOpen && messages.length > 3 && (
            <button
              onClick={() => this.setState({ focused: true })}
              className="text-gray-400 pl-2"
            >
              See full conversation
            </button>
          )}

          <div
            className={isOpen ? "overflow-auto px-2 pb-2" : "pb-2"}
            ref={this.messagesRef}
          >
            <Messages
              maxSize={isOpen ? 0 : 100}
              messages={isOpen ? messages : messages.slice(-3)}
              showNoMessages={isOpen}
            />
          </div>
          <div className={isOpen ? "px-2" : "pr-4"}>
            <Input
              autoFocus={isOpen}
              avatar={avatar}
              onNewMessage={this.onNewMessage}
              text={text}
              onChange={(text) => this.setState({ text })}
              onFocus={() => {
                this.setState({ focused: true });
              }}
              onBlur={() => {
                this.clearTimeout();
                this.setState({ focused: false, open: false });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

function Messages({ messages, maxSize = 0, showNoMessages = false }) {
  if (messages.length === 0) {
    if (showNoMessages) {
      return (
        <div className="h-full min-h-[4rem] w-full flex justify-center items-center">
          No messages yet
        </div>
      );
    } else {
      return null;
    }
  }

  return messages.map((message, i) => {
    let sliced = false;
    let text = message.text;
    if (maxSize > 0 && message.text.length > maxSize) {
      text = text.slice(0, maxSize);
      sliced = true;
    }

    return (
      <div className="pl-2 flex items-start space-x-2" key={message.id}>
        <div className="w-6 h-6 pt-2 py-0.5 shrink-0">
          <Avatar animal={message.avatar} />
        </div>

        <div className="p-2">
          {text}
          {sliced ? <span className="text-gray-400 pl-2">[...]</span> : ""}

          {/* 
            <span className="text-gray-400 pl-2">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
           */}
        </div>
      </div>
    );
  });
}

class Input extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onNewMessage();
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      this.handleSubmit(e);
      this.resize(e);
    }
  };

  handleKeyUp = (e) => {
    this.resize(e);
  };

  resize(e) {
    e.target.style.height = "inherit";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  }

  render() {
    const { avatar, onFocus, onBlur, autoFocus, text, onChange } = this.props;

    return (
      <form
        onSubmit={this.handleSubmit}
        className="w-full font-semibold flex flex-row items-center rounded-xl pl-2 pr-1 py-1 ring-2 bg-gray-50 ring-gray-200 focus-within:ring-gray-400 space-x-2"
      >
        <div className="w-6 h-6 shrink-0">
          <Avatar animal={avatar} />
        </div>

        <textarea
          autoFocus={autoFocus}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          className="peer resize-none w-full py-1 pl-2 pr-0 ring-none border-none leading-snug bg-transparent placeholder:text-gray-300 text-md focus:ring-0 text-gray-600"
          rows={1}
          placeholder="Say something..."
          value={text}
          onChange={(e) => {
            onChange(e.currentTarget.value);
          }}
        />

        <button
          type="submit"
          className="py-0.5 px-2 rounded-lg bg-transaprent text-gray-300 peer-focus:text-gray-500 mt-[1px]"
        >
          Send
        </button>
      </form>
    );
  }
}

export class ChatExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.messages,
    };
  }

  render() {
    const { playerId, avatar } = this.props;
    const { messages } = this.state;

    return (
      <Chat
        messages={messages}
        avatar={avatar}
        onNewMessage={(text) => {
          const t = text.trim();
          if (t.length === 0) {
            return;
          }
          console.log("text:", t);
          this.setState({
            messages: [
              ...this.state.messages,
              {
                text: t,
                avatar,
                playerId,
                self: true,
                id: randID(),
                timestamp: Date.now(),
              },
            ],
          });
        }}
      />
    );
  }
}

function randID() {
  return Math.random().toString(16).slice(8);
}
