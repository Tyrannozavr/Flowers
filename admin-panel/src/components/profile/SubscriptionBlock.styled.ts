import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const SubscriptionContainer = styled.div`
  width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  animation: ${fadeIn} 0.3s ease-in;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
  }
`;

export const Title = styled.h2`
  color: #000000;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

export const Description = styled.p`
  color: #666666;
  font-size: 16px;
  line-height: 1.5;
  margin: 1rem 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'danger' | 'disabled' }>`
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return css`
          background: #E9033A;
          color: white;
          &:hover {
            background: #D6002F;
          }
        `;
      case 'disabled':
        return css`
          background: #cccccc;
          color: white;
          cursor: not-allowed;
          &:hover {
            background: #cccccc;
          }
        `;
      default:
        return css`
          background: #30AA6E;
          color: white;
          &:hover {
            background: #2C9E64;
          }
        `;
    }
  }}

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 0.6rem 1.2rem;
  }
`;

export const EmailInput = styled.input`
  width: 300px;
  padding: 0.8rem;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  font-size: 16px;
  margin: 1rem 0;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }

  @media (max-width: 768px) {
    width: 200px;
    font-size: 14px;
  }
`;

export const ErrorText = styled.p`
  color: #E9033A;
  font-size: 14px;
  margin-top: 0.5rem;
`;

export const ConsentLabel = styled.label<{ isError?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 0.8rem 0;
  cursor: pointer;
  color: ${props => props.isError ? '#E9033A' : '#000000'};
  font-size: 16px;
  transition: color 0.2s ease;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const ConsentCheckbox = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.checked ? '#30AA6E' : '#D9D9D9'};
  background: ${props => props.checked ? '#30AA6E' : 'white'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: white;
    opacity: ${props => props.checked ? 1 : 0};
  }
`;

export const ContactInfo = styled.p<{ isHighlighted?: boolean }>`
  color: ${props => props.isHighlighted ? '#30AA6E' : '#666666'};
  font-size: 14px;
  margin: 0.5rem 0;
  line-height: 1.4;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Link = styled.a`
  color: #30AA6E;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const StatusText = styled.p<{ variant?: 'success' | 'error' }>`
  font-size: 16px;
  color: ${props => props.variant === 'error' ? '#E9033A' : '#30AA6E'};
  margin: 1rem 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
