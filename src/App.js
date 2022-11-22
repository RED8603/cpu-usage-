import "./App.css";
import Chat from "./componenets/Chat";
import uniqid from "uniqid";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import CpuStats from "./componenets/CpuStats";
export const url = "http://localhost:9000/";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "30px 20px",
    width: "500px",
  },
};

function App() {
  //random user id for chatRoom
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState();

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [userName, setUserName] = useState("");

  const newUser = () => {
    openModal();
  };
  useEffect(() => {
    let user = localStorage.getItem("user");

    if (!user) {
      newUser();
    } else {
      user = JSON.parse(user);
      setCurrentUser(user);
    }
  }, []);

  //-------------------------------User handler----------------------------------------

  const submitHandle = async (e) => {
    e.preventDefault();

    if (userName === "") {
      alert("enter user name");
    } else {
      try {
        let userId = uniqid();
        console.log(userId);
        let user = { name: userName, id: userId };
        let { data } = await axios.post(`${url}newUser`, user);
        alert("user created");
        setCurrentUser(user);
        console.log(user, "user set");
        user = JSON.stringify(user);
        localStorage.setItem("user", user);
        closeModal();
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  //---------------------------------send text message--------------------------------
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {" "}
          <button onClick={closeModal}>close</button>
        </div>

        <div style={{ padding: "20px 20px" }}>
          <form onSubmit={submitHandle}>
            <input
              onChange={(e) => setUserName(e.target.value)}
              placeholder="inter room name"
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <button>Enter</button>
            </div>
          </form>
        </div>
      </Modal>
      <Chat currentUser={currentUser} />
      <CpuStats />
    </div>
  );
}

export default App;
