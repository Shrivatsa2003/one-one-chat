import { useEffect, useState,useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host  } from "../utlis/apiRoutes";
import axios from "axios";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import {io} from 'socket.io-client'

const Chaty = () => {
  const socket = useRef()
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  let [isloaded,setIsloaded]=useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsloaded(true);
      }
    }
    fetchData();
  }, [navigate]);


  try {
      useEffect(() => {
        if (currentUser) {
          socket.current = io(host);
          socket.current.emit("add-user", currentUser.responseData._id);
        }
      }, [currentUser]);
  } catch (error) {
    console.log(error);
  }

 
      useEffect(() => {
        async function fetchData() {
          if (currentUser) {
            if (
              currentUser.responseData.isAvatarImageSet ||
              currentUser.isAvatarImageSet
            ) {
              console.log(currentUser, currentChat);
              console.log(currentUser.responseData._id);
              const data = await axios.get(
                `${allUsersRoute}/${currentUser.responseData._id}`
              );
              // console.log(data.data);
              setContacts(data.data);
            } else {
              // console.log('hi');
              navigate("/setAvatar");
            }
          }
        }
        fetchData();
      }, [currentUser, currentChat, navigate]);

  

  const handleChatChange = (chat) => {
    setCurrentChat(chat);

  };


  return (
    <>
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isloaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer currentChat={currentChat}  currentUser={currentUser} socket={socket}/>
        )}
      </div>
    </Container>
    </>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
export default Chaty;
