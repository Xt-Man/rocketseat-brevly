// src/store/urlStore.ts
import { create } from "zustand"
import type { UrlItem } from "../interfaces/urlItem"
import { getListUrls, removeUrlById } from "../http/api"

// Definição do estado e das ações
interface UrlStore {
  urls: UrlItem[]
  addUrl: (url: UrlItem) => void
  removeUrl: (id: string) => void
  incrementAccess: (id: string) => void
  clearUrls: () => void
  fetchUrls: () => Promise<void>
  getOrFetchUrls: () => Promise<UrlItem[]>
  hasUrls: () => boolean,
  setUrls: (urls: UrlItem[]) => void
}

// Criação do store Zustand
export const useUrlStore = create<UrlStore>((set, get) => ({
  urls: [],
  addUrl: (url) =>
    set((state) => ({
      urls: [...state.urls, url],
    })),
  removeUrl: (id) =>{
      set((state) => ({
        urls: state.urls.filter((u) => u.id !== id),
      }))
  },
  incrementAccess: (id) =>
    set((state) => ({
      urls: state.urls.map((u) =>
        u.id === id ? { ...u, accessCount: u.accessCount + 1 } : u
      ),
    })),
  clearUrls: () => set({ urls: [] }),
  fetchUrls: async () => {
    const data = await getListUrls()
    set({ urls: data })
  },
  getOrFetchUrls: async () => {
    if (get().urls.length === 0) {
      const data = await getListUrls()
      set({ urls: data })
      return data
    }
    return get().urls
  },
  hasUrls: () => get().urls.length > 0,
  setUrls: (urls) => set({ urls })
}))
