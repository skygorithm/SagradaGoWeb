import React from 'react';
import { Modal, Button } from 'antd';
import { useContext } from 'react';
import { NavbarContext } from '../context/AllContext';

const SignInAlert = ({ open, onClose, message = "Please sign in to continue." }) => {
  const { setShowSignin, setShowSignup } = useContext(NavbarContext);

  const handleSignIn = () => {
    onClose();
    setShowSignin(true);
    setShowSignup(false);
  };

  return (
    <Modal
      title="Sign In Required"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="signin" className='filled-btn' onClick={handleSignIn}>
          Sign In
        </Button>
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default SignInAlert;