import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Form, FormInput } from 'semantic-ui-react';
import { ILicences } from '../../@Types/game';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { actionChangeGameDatas, actionResetCurrentGame } from '../../store/reducers/gameReducer';
import {
  actionPostGame,
  actionSearchGamesLicences,
} from '../../store/thunks/gameThunks';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './CreateGame.scss';

function CreateGame() {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [licence, setLicence] = useState<string>('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(actionSearchGamesLicences());
    dispatch(actionResetCurrentGame());
  }, []);

  const game = useAppSelector((state) => state.game.currentGame);

  useEffect(() => {
    if (game.id !== 0) {
      navigate(`/api/game/${game.id}`);
    }
  }, [game]);

  const licences = useAppSelector((state) => state.game.licences);
  const licencesOptions = licences.map((licence: ILicences) => {
    return {
      key: licence.id,
      text: licence.name,
      value: licence.name,
    };
  });

  const handleSubmit = async () => {
    dispatch(actionChangeGameDatas({ name: 'name', value: title }));
    dispatch(
      actionChangeGameDatas({
        name: 'license_name',
        value: licence,
      })
    );
    dispatch(actionChangeGameDatas({ name: 'email', value: email }));
    await dispatch(actionPostGame());
  };

  return (
    <div className="create-game">
      <Header />
      <div className="create-game-content">
        <h1 className="create-game-title">Créer ta partie</h1>
        <div className="create-game-form">
          <Form onSubmit={handleSubmit}>
            <FormInput
              className="create-game-input"
              label="Nom de la partie"
              placeholder="Nom de la partie"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              icon="game"
              iconPosition="left"
            />
            <label className="create-game-licences">
              Licences
              <Dropdown
                className="create-game-licences-input"
                placeholder="Licence"
                selection
                options={licencesOptions}
                value={licence}
                onChange={(e, { value }) => setLicence(value as string)}
              />
            </label>
            <FormInput
              className="create-game-input"
              label="Email du joueur"
              placeholder="Email du joueur"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="at"
              iconPosition="left"
            />
            <div className="submit-container">
              <Button className="create-game-submit-btn" content="Valider" />
            </div>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CreateGame;
