import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'

const api = axios.create({
  baseURL: BACKEND_URL ?? '/api'
})

export async function getOriginalUrlByShort(shortenedUrl: string): Promise<{ originalUrl: string }> {

  return new Promise((resolve) => setTimeout(resolve, 2000)).then(async () => {
    return { originalUrl: "https://google.com" }
  })

  const { data, status } = await api.get<{ originalUrl: string }>(`/urls/${shortenedUrl}`)

  if (status !== 200) {
    throw new Error('URL not found')
  }
  return data
}