import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormInput, Message } from 'semantic-ui-react';
import { useAppDispatch } from '../../hooks/hooks';
import { actionChangePassword } from '../../store/reducers/authReducer';
import { actionResetPassword } from '../../store/thunks/authThunks';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './Reset-password.scss';

function ResetPassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
 
  const [error, setError] = useState<string | null>(null);

  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const id = query.get('id');

  useEffect(() => {
    if (!token || !id) {
      setError('Lien de réinitialisation invalide');
    }
  }, [token, id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !id) {
      setError('Lien de réinitialisation invalide');
      return;
    }
    dispatch(actionChangePassword({
      token: token,
      id: parseInt(id),
      password: password,
      confirmPassword: confirmPassword,
    }));
    dispatch(actionResetPassword());
    navigate('/api/login');
   
  };

  return (
    <div className="reset-password">
      <Header />
      <h1 className="reset-password-title">Réinitialiser votre mot de passe</h1>
      <p className="reset-password-text">
        Veuillez choisir un nouveau mot de passe.
      </p>
      <div className="reset-password-form">
        <Form onSubmit={handleSubmit}>
          <FormInput
            label="Nouveau mot de passe"
            icon="lock"
            iconPosition="left"
            placeholder="Nouveau mot de passe"
            className="reset-password-input"
            type="password"
            value={password}
            onChange={(event) => setPassword((event.target.value))}
          />
          <FormInput
            label="Confirmation mot de passe"
            icon="lock"
            iconPosition="left"
            placeholder="Confirmation mot de passe"
            className="reset-password-input"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <Button
            type="submit"
            content="Envoyer"
            className="reset-password-submit-btn"
          />
        </Form>
      </div>
      <Footer />
    </div>
  );
}

export default ResetPassword;
