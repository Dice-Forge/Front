import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Checkbox, Container, Dropdown } from 'semantic-ui-react';
import { IGames } from '../../@Types/game';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { actionSetGameUrl } from '../../store/reducers/gameReducer';
import { actionGetGameById } from '../../store/thunks/gameThunks';
import Chat from '../Chat/Chat';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './Game.scss';
import './Sablier.scss';

const diceOptions = [
  { key: 'd4', text: 'Dé de 4', value: 'd4' },
  { key: 'd6', text: 'Dé de 6', value: 'd6' },
  { key: 'd8', text: 'Dé de 8', value: 'd8' },
  { key: 'd10', text: 'Dé de 10', value: 'd10' },
  { key: 'd12', text: 'Dé de 12', value: 'd12' },
  { key: 'd20', text: 'Dé de 20', value: 'd20' },
  { key: 'd100', text: 'Dé de 100', value: 'd100' },
];

const diceMaxValue: { [key: string]: number } = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
  d100: 100,
};

function Game() {
  const dispatch = useAppDispatch();

  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(60);
  const [selectedDice, setSelectedDice] = useState('d6');
  const [showDiceResult, setShowDiceResult] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const currentGame = useAppSelector((state) => state.game.currentGame);
  const gameId = useAppSelector((state) => state.game.gameId);
  const gameUrl = useAppSelector((state) => state.game.gameUrl);
  const [game, setGame] = useState<IGames>();
 


  useEffect(() => {
    const url = window.location.href;
    dispatch(actionSetGameUrl({ gameUrl: url }));
  }, []);

  useEffect(() => {
    dispatch(actionGetGameById());
  }, []);

  useEffect(() => {
    let interval: number;
    if (timerRunning && timeElapsed > 0) {
      interval = window.setInterval(() => {
        setTimeElapsed((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else if (timeElapsed === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeElapsed]);

  const handleDiceChange = (value: string) => {
    setSelectedDice(value);
  };

  const rollDice = () => {
    const max = diceMaxValue[selectedDice];
    const result = Math.floor(Math.random() * max) + 1;
    setDiceResult(result);
  };

  const startTimer = () => {
    setTimeElapsed(60);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  function formatTime() {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  }

  return (
    <div className="game-container">
      <Header />
      <Container className="main-content">
        <div className="create-div-title">
          <h1 className="create-title">{currentGame.name}</h1>
          <h2 className="create-subtitle">{currentGame.license_name}</h2>
        </div>
        <div className="timer-section">
          <div className="timer-controls">
            <Button
              className="timer-btn"
              onClick={timerRunning ? stopTimer : startTimer}
            >
              {timerRunning ? 'Stop' : 'Démarrer le Timer'}
            </Button>
          </div>
          <div className={`timer-sablier${!timerRunning ? '-hidden' : ''} `}>
            <span className="timer-result">{formatTime()}</span>
            <div className={`sablier ${timerRunning ? 'animate' : ''}`} />
          </div>
        </div>
        <div
          className={`dice-section ${!timerRunning ? 'sablier-hidden' : ''}`}
        >
          <div className="dice-section-throw">
            <Dropdown
              placeholder="Sélectionner un dé"
              selection
              options={diceOptions}
              onChange={(e, { value }) => handleDiceChange(value as string)}
            />
            <Button className="throw-dice-btn" onClick={rollDice}>
              Lancer le dé
            </Button>
          </div>
          <div className="dice-section-result">
            <Checkbox
              className="dice-section-checkbox"
              label="Afficher le résultat aux autres joueurs"
              checked={showDiceResult}
              onChange={() => setShowDiceResult(!showDiceResult)}
            />
            <div className={`dice-result ${!diceResult ? 'hidden' : ''}`}>
              {diceResult !== null && (
                <p>
                  Résultat du dé :{' '}
                  <span className="dice-result-number">{diceResult}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="content-section">
          <NavLink to={`/api/binder/${gameId}`} state={gameId}>
            <Button className="sheet-button" type="button">
              Fiches
            </Button>
          </NavLink>
          <Chat gameUrl={gameUrl} />
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default Game;
