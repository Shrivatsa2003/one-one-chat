import styled from "styled-components"
import robot from '../assests/robot.gif' 

const Welcome = ({currentUser}) => {
  return (
    
    
    <Container>
        <img src={robot} alt="Robot" />
        
        <h1>Welcome, <span>{currentUser.responseData.username}!</span></h1>
        <h3>please select a chat to start messaging</h3>
    </Container>
  )

}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
export default Welcome