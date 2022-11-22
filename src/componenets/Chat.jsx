import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { url } from "../App";
import { io } from "socket.io-client";

const socket = io("http://localhost:9000/");
const Chat = ({ currentUser }) => {
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState(null);
  ///-------------------------get chat messages---------------------------------

  useEffect(() => {
    socket.emit("sendChat");
    socket.on("getChat", (roomupdated) => {
      if (roomupdated) {
        setMessages(roomupdated.messages);
      }
    });
  });

  //-----------------------------------send handlers--------------------------------

  const sendHandle = async () => {
    try {
      let payload = {
        userId: currentUser.id,
        message: text,
      };
      socket.emit("add-to-room", payload);
      socket.on("chat", (roomupdated) => {
        if (roomupdated) {
          console.log(roomupdated);
          setMessages(roomupdated.messages);
        }
      });
      setText("");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div>
      {" "}
      <div id="chat" className="chat">
        <div className="conversation">
          <div className="head">
            <div className="person avatar">
              <div className="online" />
            </div>
            <h3 className="person-name">{currentUser?.name}</h3>
            <div className="buttons">
              <svg
                title="Call"
                className="audio-call icon"
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1.25em"
                width="1.25em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <svg
                title="Video-call"
                className="video-call icon"
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1.25em"
                width="1.25em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
              </svg>
              <svg
                id="button-options"
                className="button-option icon"
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1.25em"
                width="1.25em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx={12} cy={12} r={10} />
                <line x1={12} y1={16} x2={12} y2={12} />
                <line x1={12} y1={8} x2="12.01" y2={8} />
              </svg>
            </div>
          </div>
          <div id="messages" className="messages">
            <div className="time">Today</div>
            {/* // message map  */}
            {messages?.map(({ message, user }, i) => (
              <div
                key={i}
                className={
                  user === currentUser?.id ? "msg-text owner" : "msg-text"
                }
              >
                <span className="text">{message}</span>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>
          <div className="field">
            <svg
              className="emoji icon"
              stroke="currentColor"
              fill="none"
              strokeWidth={0}
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            {/* ----------------message input ------------------ */}
            <input
              onChange={(e) => {
                setText(e.target.value);
              }}
              id="input-message"
              className="input-message"
              type="text"
              value={text}
              placeholder="Type something..."
            />
            <div className="icon plus">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </div>
            {/* ----------------send Button----------------- */}
            <div onClick={sendHandle} id="send-text" className="icon send text">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1={22} y1={2} x2={11} y2={13} />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
            <div id="send-audio" className="icon send audio">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1={12} y1={19} x2={12} y2={23} />
                <line x1={8} y1={23} x2={16} y2={23} />
              </svg>
            </div>
          </div>
        </div>
        <div id="options" className="options">
          <div className="head">
            <div id="close-options" className="close icon">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="2em"
                width="2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1={19} y1={12} x2={5} y2={12} />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </div>
          </div>
          <div className="info">
            <div className="person photo">
              <div className="online" />
            </div>
            <h2 className="name"> {currentUser?.name} </h2>
            <div className="buttons">
              <div className="button">
                <div className="icon">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <p className="title">Audio</p>
              </div>
              <div className="button">
                <div className="icon">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
                  </svg>
                </div>
                <p className="title">Video</p>
              </div>
              <div className="button">
                <div className="icon">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx={12} cy={7} r={4} />
                  </svg>
                </div>
                <p className="title">Profile</p>
              </div>
              <div className="button">
                <div className="icon">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <p className="title">Mute</p>
              </div>
            </div>
            <hr />
            <div className="details">
              <label className="search-field">
                <div className="icon">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx={11} cy={11} r={8} />
                    <line x1={21} y1={21} x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  id="search"
                  className="search"
                  type="text"
                  placeholder="Search"
                />
              </label>
              <label className="dark-mode">
                <span className="label">Dark Mode</span>
                <input id="input-dark" className="input-dark" type="checkbox" />
                <div className="toggle">
                  <div className="circle" />
                </div>
              </label>
              <div className="theme">
                <span className="label">Theme</span>
                <div className="colors">
                  <div id="color-blue" className="color blue" />
                  <div id="color-red" className="color red" />
                  <div id="color-green" className="color green" />
                  <div id="color-purple" className="color purple" />
                </div>
              </div>
              <div className="media">
                <span className="label">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Shared photos</span>
                </span>
                <div className="photos">
                  <img className="img" src="https://i.imgur.com/8jqYvFL.jpeg" />
                  <img className="img" src="https://i.imgur.com/jlFgGpe.jpeg" />
                  <img className="img" src="https://i.imgur.com/BfyXuwR.gif" />
                </div>
                <span className="view-more">View more</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
