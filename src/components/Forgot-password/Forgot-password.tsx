import { useState } from 'react';
import { Button, Form, FormInput, Message } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { actionSetForgotPasswordEmail } from '../../store/reducers/authReducer';
import { actionForgotPassword } from '../../store/thunks/authThunks';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './Forgot-password.scss';

function ForgotPassword() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');

  const handlesubmit = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    dispatch(actionSetForgotPasswordEmail(email));
    dispatch(actionForgotPassword());

  };
  const storeEmail = useAppSelector((state) => state.auth.email); 
  const message = useAppSelector((state) => state.auth.message);
  const error = useAppSelector((state) => state.auth.error);
  return (
    <div className="forgot-password">
      <Header />
      <h1 className="forgot-password-title">Mot de passe oublié ?</h1>
      <p className="forgot-password-text">
        Vous allez recevoir un e-mail vous permettant de modifier votre
        mot de passe.
      </p>
      <div className="forgot-password-form">
        <Form onSubmit={handlesubmit}>
          <FormInput
            label="Email"
            icon="at"
            iconPosition="left"
            placeholder="Email"
            className="forgot-password-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button
            type="submit"
            content="Envoyer"
            className="forgot-password-submit-btn"
          />
        </Form>
      </div>
      <Footer />
    </div>
  );
}

export default ForgotPassword;