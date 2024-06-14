import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [isUsernameSet, setIsUsernameSet] = useState(
    !!localStorage.getItem("username")
  );
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "pastMessages") {
        setMessages(data.data);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = async () => {
    setIsUploading(true);
    let fileUrl = "";
    let fileName = "";
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(process.env.REACT_APP_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      fileUrl = data.fileUrl;
      fileName = file.name;
    }

    const messageData = { username, message, fileUrl, fileName };

    ws.current.send(JSON.stringify(messageData));
    setMessage("");
    setFile(null);
    setIsUploading(false);
  };

  const handleUsernameSubmit = () => {
    localStorage.setItem("username", username);
    setIsUsernameSet(true);
  };

  if (!isUsernameSet) {
    return (
      <div className="username-container">
        <h4>Pick a username</h4>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleUsernameSubmit} disabled={!username}>
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Group Chat</h1>
        </div>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              className={`chat-message ${
                msg.username === username ? "own-message" : ""
              }`}
              key={index}
            >
              <strong>
                <small>{msg.username}</small>
              </strong>
              <br />
              {msg.message}
              {msg.fileUrl && (
                <div>
                  {[".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].some(
                    (ext) => msg?.fileName?.toLowerCase().endsWith(ext)
                  ) ? (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={msg.fileUrl} alt={msg.fileName} width="80px" />
                    </a>
                  ) : (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {msg.fileName}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <textarea
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={sendMessage} disabled={!message && !file}>
            {isUploading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
