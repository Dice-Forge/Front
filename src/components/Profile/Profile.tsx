import { NavLink } from 'react-router-dom';
import { Button, Icon, Image } from 'semantic-ui-react';
import { useAppSelector } from '../../hooks/hooks';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './Profile.scss';

function Profile() {
  const lastname = useAppSelector((state) => state.user.lastname);
  const firstname = useAppSelector((state) => state.user.firstname);

  return (
    <div className="profile">
      <Header />
      <div className="profile-page">
        <div className="profile-user">
          <Image
            src="public/LogoDiceForge.jpg"
            circular
            size="small"
            className="profile-avatar"
          />
          <div className="profile-user-name">
            <p>{lastname}</p>
            <p>{firstname}</p>
          </div>
        </div>
        <div className="game-session">
          <div className="profile-game">
            <h2 className="profile-game-title">
              Parties
              <NavLink to="/api/creategame">
                <Button
                  className="profile-game-btn"
                  content="Crée une partie"
                  color="red"
                  compact
                  size="mini"
                />
              </NavLink>
            </h2>

            <div className="profile-game-edit">
              <Icon size="large" name="pencil" />
              <Icon size="large" name="trash" />
              <p>partie1</p>
            </div>
          </div>
          <div className="profile-session">
            <h2 className="profile-session-title">Session à venir :</h2>
            <div className="profile-session-edit">
              <Button content="-" size="mini" compact />
              <p className="profile-session-edit-date">
                partie 1 : Prochaine session le 22/05/24
              </p>
            </div>
            <div className="profile-session-edit">
              <Button content="+" size="mini" compact />
              <p className="profile-session-edit-date">
                partie 2 : Pas de session programmés
              </p>
            </div>
            <div className="profile-session-edit">
              <Button content="+" size="mini" compact />
              <p className="profile-session-edit-date">
                partie 3 : Pas de session programmés
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
