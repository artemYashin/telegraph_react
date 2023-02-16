import { create } from 'zustand';

export type Store = {
  selectedArticle: number,
  setSelectedArticle: (id: number) => void
};

export const useStore = create<Store>((set) => ({
  selectedArticle: 0,
  setSelectedArticle: (id: number) => set({ selectedArticle: id }),
}));
