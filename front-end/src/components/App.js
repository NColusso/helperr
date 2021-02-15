import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar/Navbar";
import Map from "./Map";
import ChatNav from "./Chat/ChatNav";
import { Input } from "@material-ui/core";
import { io } from "socket.io-client";
import Jobs from "./Jobs";
import Chat from "./Chat/Chat";
import fixtures from "./helpers/__mocks__/axios";
import useAppData from "./helpers/hooks/useAppData";
const _socket = io.connect("http://localhost:8080", {
  transports: ["websocket"],
});

const useChatSocket = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(_socket);
  const socket = socketRef.current;

  const sendMessage = ({ name, message }) => {
    return socket.emit("message", { name, message });
  };

  useEffect(() => {
    socket.removeAllListeners();
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  });
  return { messages, sendMessage };
};

export default function App() {
  const { messages, sendMessage } = useChatSocket();

  // fixtures has: users, jobs, categories, offers, messages, reviews
  // const { users, jobs, categories, offers, messages, reviews } = fixtures;
  const { state, setJobView, setPostCode } = useAppData();

  return (
    <div className="App">
      <Navbar />
      <div className="containers">
        <div className="map-container">
          <Map />
        </div>

        <div className="jobs-container">
          <Jobs
            state={state}
            setJobView={setJobView}
            messages={messages}
            sendMessage={sendMessage}
          />
          {/* <Chat messages={messages} sendMessage={sendMessage} /> */}
          <ChatNav setJobView={setJobView} />
        </div>
      </div>
    </div>
  );
}
