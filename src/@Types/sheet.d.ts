export interface Characteristic {
  id: string;
  name: string;
  value: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
}

export interface ISheet {
  class: string;
  created_at: string;
  game_id: number | null;
  id: number;
  image?: string;
  level: number;
  name: string;
  updated_at: string | null;
}

declare module 'uuid' {
  export function v4(): string;
}
