import React, { useEffect, useRef, useState } from 'react';
import { Button, Dropdown, DropdownProps, Modal } from 'semantic-ui-react';
import io, { Socket } from 'socket.io-client';
import { useAppSelector } from '../../hooks/hooks';
import './Chat.scss';

interface Message {
  sender: string;
  content: string;
}

function Chat({ gameUrl }: { gameUrl: string }) {
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    Chatbox: [],
    Notes: [],
    MJ: [],
    '...': [],
  });

  const [input, setInput] = useState('');
  const [tabs, setTabs] = useState(['Chatbox', 'Notes', 'MJ', '...']);
  const [activeTab, setActiveTab] = useState('Chatbox');
  const [modalOpen, setModalOpen] = useState(false);
  const [newTabType, setNewTabType] = useState('');

  const userName = useAppSelector((state) => state.auth.user.firstname);

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io('http://localhost:3000');
    socket.current.on('message', (message: Message) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeTab]: [...prevMessages[activeTab], message],
      }));
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [activeTab, gameUrl]);

  const sendMessage = () => {
    if (input.trim() && socket.current) {
      const message: Message = { sender: userName, content: input };
      socket.current.emit('message', message);
      setMessages({
        ...messages,
        [activeTab]: [...messages[activeTab], message],
      });
      setInput('');
    }
  };

  const addTab = () => {
    setModalOpen(true);
  };

  const handleTabTypeChange = (
    e: React.SyntheticEvent<HTMLElement>,
    { value }: DropdownProps
  ) => {
    setNewTabType(value as string);
  };

  const handleAddTab = () => {
    if (newTabType) {
      const newTabName = `${newTabType} ${
        tabs.filter((tab) => tab.startsWith(newTabType)).length + 1
      }`;
      setTabs([...tabs, newTabName]);
      setMessages({ ...messages, [newTabName]: [] });
      setActiveTab(newTabName);
      setModalOpen(false);
      setNewTabType('');
    }
  };

  const tabTypes = [
    { key: 'Chatbox', text: 'Chatbox', value: 'Chatbox' },
    { key: 'Notes', text: 'Notes', value: 'Notes' },
    { key: 'MJ', text: 'MJ', value: 'MJ' },
    { key: '...', text: '...', value: '...' },
  ];

  function uuid(): React.Key | null | undefined {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={
              activeTab === tab ? 'onglet-button-active' : 'onglet-button'
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <button className="onglet-button" type="button" onClick={addTab}>
          + Add Tab
        </button>
      </div>
      <div className="chat-messages">
        {activeTab === 'Notes' ? (
          <textarea
            className="notes-textarea"
            placeholder="Ecrivez vos notes ici ..."
          />
        ) : (
          messages[activeTab].map((msg) => (
            <div
              key={uuid()}
              className="chat-message"
            >
              <strong>{msg.sender}: </strong>
              {msg.content}
            </div>
          ))
        )}
      </div>
      <div className="chat-input-form">
        {activeTab !== 'Notes' && (
          <>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ecrivez votre message"
            />
            <button
              className="chat-input-btn"
              type="button"
              onClick={sendMessage}
            >
              Envoyer
            </button>
          </>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>Select the tab type you want to add</Modal.Header>
        <Modal.Content>
          <Dropdown
            placeholder="Choisissez votre onglet"
            selection
            options={tabTypes}
            onChange={handleTabTypeChange}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleAddTab}>Add Tab</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default Chat;
