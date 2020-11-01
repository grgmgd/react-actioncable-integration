import React, { memo, useCallback, useEffect, useState } from "react";
import { ActionCableConsumer } from "react-actioncable-provider";
import network from "../utils/network";

const CONVERSATION_ID = 1;

const Chat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    network({
      url: `http://localhost:3000/v1/admin/conversations/${CONVERSATION_ID}/messages`,
    }).then(({ data: { messages: _messages } }) => {
      setMessages(_messages.reverse());
    });
  }, []);

  const onMessageRecieved = useCallback((value) => {
    console.log(value);
    const { message } = value;
    if (message) setMessages((state) => [...state, message]);
  }, []);

  const onConnected = useCallback(() => {
    console.log("socket connected");
  }, []);

  const onDisconnected = useCallback(() => {
    console.log("socket disconnected");
  }, []);

  return (
    <div>
      <div style={{ height: "70vh", overflowY: "scroll", width: "100vw" }}>
        <TheCable
          onMessageRecieved={onMessageRecieved}
          onConnected={onConnected}
          onDisconnected={onDisconnected}
        />
        {messages.map((message) => (
          <div
            style={{
              color: "black",
              padding: 20,
              backgroundColor: "#ededed",
              width: 200,
              borderRadius: 20,
              marginBottom: 30,
              fontSize: 20,
              marginLeft:
                message.sender.email === localStorage.getItem("uid")
                  ? "auto"
                  : 0,
            }}
          >
            {message.body}
          </div>
        ))}
      </div>
      <Input />
    </div>
  );
};

const TheCable = memo(({ onMessageRecieved, onConnected, onDisconnected }) => (
  <ActionCableConsumer
    channel={{
      channel: "ConversationChannel",
      conversation: CONVERSATION_ID,
    }}
    onReceived={onMessageRecieved}
    onConnected={onConnected}
    onDisconnected={onDisconnected}
  />
));
const Input = () => {
  const [input, setInput] = useState("");

  const onInputChange = useCallback((event) => {
    setInput(event.target.value);
    // network({
    //   url: `http://localhost:3000/v1/admin/conversations/${CONVERSATION_ID}/messages/typing`,
    //   method: "POST",
    //   data: { typing: true },
    // }).then(() => {
    //   setTimeout(() => {
    //     network({
    //       url: `http://localhost:3000/v1/admin/conversations/${CONVERSATION_ID}/messages/typing`,
    //       method: "POST",
    //       data: { typing: false },
    //     });
    //   }, 2000);
    // });
  }, []);

  const onSubmit = useCallback(
    (event) => {
      if (event.key !== "Enter") return;
      if (input === "") return;
      network({
        url: `http://localhost:3000/v1/admin/conversations/${CONVERSATION_ID}/messages`,
        method: "POST",
        data: { message: { body: input } },
      }).then(() => {
        setInput("");
      });
    },
    [input]
  );

  return <input value={input} onChange={onInputChange} onKeyDown={onSubmit} />;
};

export default Chat;
