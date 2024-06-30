import { ChangeEvent, useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Form, FormInput, FormTextArea } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';
import { IGames } from '../../@Types/game';
import { Characteristic, Item } from '../../@Types/sheet';
import axiosInstance from '../../axios/axios';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './CreateSheet.scss';

interface SheetData {
  name: string;
  image: string | null;
  class: string;
  level: number;
  game_id: number;
  user_id: number;
  license: string;
  characteristics: {
    name: string;
    value: string;
  }[];
  items: {
    name: string;
    description: string;
    quantity: number;
  }[];
}

function CreateSheet() {
  const gameId = useAppSelector((state) => state.game.currentGame.id);

  const [characteristics, setCharacteristics] = useState<Characteristic[]>([
    { id: uuidv4(), name: '', value: '' },
  ]);
  const [items, setItems] = useState<Item[]>([
    { id: uuidv4(), name: '', description: '', quantity: 1 },
  ]);
  const [characterName, setCharacterName] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [games, setGames] = useState<IGames[]>([]);
  const [level, setLevel] = useState<number>(1);
  const [selectedGameId, setSelectedGameId] = useState<number>(gameId);
  const [license, setLicense] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const userId = useAppSelector((state) => state.auth.user.userId);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const getGame = async () => {
      try {
        const response = await axiosInstance.get(`/profile/${userId}`);
        setGames(response.data);
      } catch (error) {
        console.log('error', error);
      }
    };
    getGame();
  }, [dispatch, userId]);

  const postUserCreateSheet = async (datas: SheetData) => {
    try {
      const response = await axiosInstance.post('sheet', datas);
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddCharacteristic = () => {
    setCharacteristics([
      ...characteristics,
      { id: uuidv4(), name: '', value: '' },
    ]);
  };

  const handleRemoveCharacteristic = (id: string) => {
    setCharacteristics(characteristics.filter((char) => char.id !== id));
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), name: '', description: '', quantity: 1 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleCharacteristicChange = (
    id: string,
    key: keyof Characteristic,
    value: string
  ) => {
    setCharacteristics(
      characteristics.map((char) =>
        char.id === id ? { ...char, [key]: value } : char
      )
    );
  };

  const handleGameChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGameId(Number(event.target.value));
  };

  const handleItemChange = (
    id: string,
    key: keyof Item,
    value: string | number
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
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

  const handleSubmit = () => {
    const datas = {
      name: characterName,
      image: avatarPreview,
      class: className,
      level: level,
      game_id: selectedGameId,
      user_id: userId,
      license: license,
      characteristics: characteristics.map((char) => ({
        name: char.name,
        value: char.value,
      })),
      items: items.map((item) => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
      })),
    };

    JSON.stringify(datas);
    postUserCreateSheet(datas);
  };

  return (
    <div className="create-sheet">
      <Header />
      <h1 className="create-sheet-title">Création de Fiche</h1>
      <div className="create-sheet-content">
        <Form className="create-sheet-form">
          <div>
            <div>
              <div className="create-sheet-game">
                <select
                  id="game-select"
                  className="create-sheet-game-name"
                  value={selectedGameId}
                  onChange={handleGameChange}
                >
                  <option value="" disabled>
                    Choisissez une partie
                  </option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>
              <FormInput
                label="Nom du personnage"
                className="create-sheet-input"
                placeholder="Nom de votre personnage"
                value={characterName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCharacterName(e.target.value)
                }
              />
              <FormInput
                label="Classe:"
                className="create-sheet-input"
                placeholder="Classe"
                value={className}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setClassName(e.target.value)
                }
              />
              <FormInput
                label="Niveau:"
                className="create-sheet-input"
                type="number"
                placeholder="Niveau"
                value={level}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLevel(Number(e.target.value))
                }
              />
            </div>

            <div className="create-sheet-avatar">
              <span>Importer un avatar </span>
              <input type="file" onChange={handleAvatarChange} />
              {avatarPreview && (
                <div className="create-sheet-avatar-preview">
                  <img
                    className="create-sheet-avatar-img"
                    src={avatarPreview}
                    alt="Avatar Preview"
                  />
                </div>
              )}
            </div>
          </div>
          {characteristics.map((characteristic) => (
            <div className="create-sheet-caracteristic" key={characteristic.id}>
              <FormInput
                className="create-sheet-input"
                label="Caractéristique :"
                placeholder="Nom"
                value={characteristic.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleCharacteristicChange(
                    characteristic.id,
                    'name',
                    e.target.value
                  )
                }
              />
              <FormInput
                label="Valeur :"
                className="create-sheet-input-value"
                type="number"
                placeholder="Entre -5 et 5"
                value={characteristic.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleCharacteristicChange(
                    characteristic.id,
                    'value',
                    e.target.value
                  )
                }
              />
              <Button
                className="create-sheet-caracteristic-btn"
                icon="minus"
                onClick={() => handleRemoveCharacteristic(characteristic.id)}
              />
            </div>
          ))}
          <Button
            className="create-sheet-caracteristic-add-btn"
            onClick={handleAddCharacteristic}
            icon="plus"
          />

          <h2 className="create-sheet-subtitle">Inventaire</h2>
          {items.map((item) => (
            <div className="create-sheet-inventory-content">
              <FormInput
                className="create-sheet-input"
                label="Nom de l'objet :"
                placeholder="Nom de l'objet"
                value={item.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleItemChange(item.id, 'name', e.target.value)
                }
              />
              <FormTextArea
                className="create-sheet-input"
                label="Description"
                placeholder="Entrez ici la description de votre objet"
                value={item.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleItemChange(item.id, 'description', e.target.value)
                }
              />
              <div className="create-sheet-inventory-quantity">
                <FormInput
                  className="create-sheet-input-quantity"
                  label="Quantité :"
                  placeholder="Quantité"
                  type="number"
                  value={item.quantity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleItemChange(
                      item.id,
                      'quantity',
                      Number(e.target.value)
                    )
                  }
                />
                <Button
                  className="create-sheet-inventory-btn"
                  icon="minus"
                  onClick={() => handleRemoveItem(item.id)}
                />
              </div>
            </div>
          ))}
          <Button
            className="create-sheet-inventory-add-btn"
            onClick={handleAddItem}
            icon="plus"
          />
          <div className="submit-btn">
            <Button
              className="create-sheet-submit-btn"
              type="submit"
              content="Valider"
              onClick={handleSubmit}
            />
          </div>
        </Form>
      </div>
      <Footer />
    </div>
  );
}

export default CreateSheet;
