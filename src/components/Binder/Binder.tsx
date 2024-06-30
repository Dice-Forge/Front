import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, CardGroup, Container } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { actionGetSheets } from '../../store/thunks/sheetThunks';
import CardItem from '../CardItem/CardItem';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './Binder.scss';

function Binder() {
  const dispatch = useAppDispatch();

  const sheetName = useAppSelector((state) => state.sheet.sheetName);
  const sheets = useAppSelector((state) => state.sheet.sheets);

  const gameId = useAppSelector((state) => state.game.currentGame.id);

  useEffect(() => {
    dispatch(actionGetSheets());
  }, []);

  return (
    <div className="binder">
      <Header />
      <h1 className="binder-title">Classeur de fiches</h1>
      <Container>
        <CardGroup className="binder-card-container">
          {sheets.map((sheet) => (
            <CardItem key={sheet.id} {...sheet} />
          ))}
        </CardGroup>
      </Container>
      <NavLink to="/api/createsheet">
        <Button className="binder-btn-createsheet" content="Créer une fiche" />
      </NavLink>
      <NavLink to="/api/game/">
        <Button
          className="binder-btn-backToGame"
          content="Retour à la partie"
        />
      </NavLink>
      <Footer />
    </div>
  );
}

export default Binder;
