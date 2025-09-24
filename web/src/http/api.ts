import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'
import type { UrlItem } from '../interfaces/urlItem'

const api = axios.create({
  baseURL: BACKEND_URL ?? '/api'
})

export async function getOriginalUrlByShort(shortenedUrl: string): Promise<{ originalUrl: string }> {

  const { data, status } = await api.get<{ originalUrl: string }>(`/urls/${shortenedUrl}`)

  if (status !== 200) {
    throw new Error('URL not found')
  }
  return data
}

export async function getListUrls(): Promise<UrlItem[]> {
  const { data, status } = await api.get('/urls')
  // if (status !== 200) {
  //   throw new Error('Error fetching URLs')
  // }
  return data as UrlItem[]
}

export async function removeUrlById(id: string): Promise<boolean> {
  const { status } = await api.delete(`/urls/${id}`)

  return status === 204
}

export async function getCsvLink(): Promise<string> {
  const { data, status } = await api.post('/urls/csv', {})

  if (status === 200)
    return data.exportedCsvUrl

  return ''
}

export async function createShortUrl(originalUrl: string, shortenedUrl: string): Promise<void> {
  
  await api.post('/urls', { originalUrl, shortenedUrl })

}