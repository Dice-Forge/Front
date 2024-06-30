import { createAction, createReducer } from '@reduxjs/toolkit';
import { IGames, ILicences } from '../../@Types/game';
import {
  actionDeleteGame,
  actionGetGameById,
  actionPostGame,
  actionSearchGames,
  actionSearchGamesLicences,
} from '../thunks/gameThunks';

export interface GameState {
  games: IGames[];
  gameId: number;
  licences: ILicences[];
  gameDatas: {
    name: string;
    license_name: String;
    email: string;
  };
  currentGame: IGames;
  gameUrl: string;
  error: string;
}

export const gameInitialState: GameState = {
  games: [],
  gameId: 0,
  licences: [],
  gameDatas: {
    name: '',
    license_name: '',
    email: '',
  },
  currentGame: {
    created_at: '',
    event: null,
    id: 0,
    invitation_token: null,
    license_name: '',
    music: null,
    name: '',
    note: null,
    updated_at: null,
  },
  gameUrl: '',
  error: '',
};

export const actionResetCurrentGame = createAction('RESET_CURRENT_GAME');

export const actionChangeGameDatas = createAction<{
  name: 'name' | 'license_name' | 'email';
  value: string;
}>('CHANGE_GAME_DATAS');

export const actionSetGameId = createAction<number>('SET_GAME_ID');

export const actionSetGameUrl = createAction<{ gameUrl: string }>(
  'SET_GAME_URL'
);

export const actionPushEmail = createAction<string>('PUSH_EMAIL');

export const actionRemoveEmail = createAction<string>('REMOVE_EMAIL');

const gameReducer = createReducer(gameInitialState, (builder) => {
  builder
    .addCase(actionSearchGames.fulfilled, (state, action) => {
      state.games = action.payload;
    })
    .addCase(actionSearchGames.rejected, (state, action) => {
      state.error = action.error.message || 'error';
    })
    .addCase(actionSetGameId, (state, action) => {
      state.gameId = action.payload;
    })
    .addCase(actionSearchGamesLicences.fulfilled, (state, action) => {
      state.licences = action.payload;
    })
    .addCase(actionSearchGamesLicences.rejected, (state, action) => {
      state.error = action.error.message || 'error';
    })
    .addCase(actionChangeGameDatas, (state, action) => {
      state.gameDatas[action.payload.name] = action.payload.value;
    })
    .addCase(actionPostGame.fulfilled, (state, action) => {

      state.currentGame = action.payload.createdGame;
    })
    .addCase(actionResetCurrentGame, (state) => {
      state.currentGame = {
        created_at: '',
        event: null,
        id: 0,
        invitation_token: null,
        license_name: '',
        music: null,
        name: '',
        note: null,
        updated_at: null,
      };
    })
    .addCase(actionGetGameById.fulfilled, (state, action) => {

      state.currentGame = action.payload;

    })
    .addCase(actionSetGameUrl, (state, action) => {
      if (action.payload) {
      }
    })
    .addCase(actionDeleteGame.fulfilled, (state) => {
      const updatedGames = state.games.filter(
        (game) => game.id !== state.gameId
      );
      state.games = updatedGames;
    });
});

export default gameReducer;
