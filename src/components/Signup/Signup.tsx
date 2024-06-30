import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormInput } from 'semantic-ui-react';
import { useAppDispatch } from '../../hooks/hooks';
import { actionChangeNewUser } from '../../store/reducers/authReducer';
import {
  actionCheckLogin,
  actionRegister,
} from '../../store/thunks/authThunks';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './Signup.scss';

function Signup() {
  const dispatch = useAppDispatch();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(actionChangeNewUser({ name: 'lastname', value: lastName }));
    dispatch(actionChangeNewUser({ name: 'firstname', value: firstName }));
    dispatch(actionChangeNewUser({ name: 'email', value: email }));
    dispatch(actionChangeNewUser({ name: 'password', value: password }));
    dispatch(
      actionChangeNewUser({ name: 'confirmPassword', value: confirmPassword })
    );
    await dispatch(actionRegister());
    await dispatch(actionCheckLogin());
    navigate('/');
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="signup">
      <Header />
      <h1 className="signup-title">Inscription</h1>
      <Form className="signup-form" onSubmit={handleSubmit}>
        <FormInput
          className="signup-input"
          icon="user"
          iconPosition="left"
          label="Nom"
          placeholder="Nom"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        <FormInput
          className="signup-input"
          icon="user"
          iconPosition="left"
          label="Prénom"
          type="text"
          placeholder="Prénom"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <FormInput
          className="signup-input"
          icon="at"
          iconPosition="left"
          label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <FormInput
          className="signup-input"
          icon="lock"
          iconPosition="left"
          label="Mot de passe"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <FormInput
          className="signup-input"
          icon="lock"
          iconPosition="left"
          label="Confirmation"
          type="password"
          placeholder="Confirmation mot de passe"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <Button content="Valider" type="submit" className="signup-form-btn" />
      </Form>
      <Footer />
    </div>
  );
}

export default Signup;
