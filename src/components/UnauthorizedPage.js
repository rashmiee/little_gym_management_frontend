import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import unauthorize from './images/unathorize.png'

const UnauthorizedPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 4rem;
  position: relative;
  top: 0px;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: black;
`;

const StyledImage = styled.img`
  width: 200px;
  margin-bottom: 20px;
`;

const StyledLink = styled(Link)`
  font-size: 1.2rem;
  color: #00008B;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const UnauthorizedPage = () => {
  return (
    <UnauthorizedPageContainer>
      <Title>Unauthorized Access</Title>
      <StyledImage src={unauthorize} alt="Unauthorized" />
      <Message>
        Sorry, you are not authorized to access this page.
      </Message>
      <StyledLink to="/">Go to Home Page</StyledLink>
    </UnauthorizedPageContainer>
  );
};

export default UnauthorizedPage;
