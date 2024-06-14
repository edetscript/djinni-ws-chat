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
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    autoGrowTextarea();
  };

  const [isUsernameSet, setIsUsernameSet] = useState(
    !!localStorage.getItem("username")
  );

  const autoGrowTextarea = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

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

  useEffect(() => {
    autoGrowTextarea();
  }, [message]);

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
          <h1>Открыть чат</h1>
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
                <ul>
                  {[".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].some(
                    (ext) => msg?.fileName?.toLowerCase().endsWith(ext)
                  ) ? (
                    <li>
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="uploaded-image"
                          src={msg.fileUrl}
                          alt={msg.fileName}
                          width="80px"
                        />
                      </a>
                    </li>
                  ) : (
                    <li className="uploaded-file">
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {msg.fileName}
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="chat-input-wrapper">
          <div className="chat-editor-upload">
            <button
              className="plus-icon"
              onClick={handleUploadClick}
              title="Загрузить файл"
            >
              <svg
                enable-background="new 0 0 24 24"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                focusable="false"
              >
                <g>
                  <rect fill="none" height="20" width="20"></rect>
                </g>
                <g>
                  <g>
                    <g>
                      <path d="M6,2C4.9,2,4.01,2.9,4.01,4L4,20c0,1.1,0.89,2,1.99,2H18c1.1,0,2-0.9,2-2V8l-6-6H6z M13,9V3.5L18.5,9H13z"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </div>
          <div className="padding-10">
            <div className="chat-input">
              <textarea
                ref={textareaRef}
                placeholder="Введите сообщение..."
                value={message}
                onChange={handleTextareaChange}
              />

              <button onClick={sendMessage} disabled={!message && !file}>
                {isUploading ? "Отправка..." : "Отправлять"}
              </button>
            </div>
            <small>{file?.name}</small>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
