import axios from 'axios'
import { getApiBaseURL } from '../config/apiConfig'

function getApi() {
  return axios.create({
    baseURL: getApiBaseURL(),
    timeout: 5000,
  })
}

export async function getRecentSearches(role) {
  if (!role) return []
  const api = getApi()
  const response = await api.get('/search/recent', { params: { role } })
  return response.data?.items ?? []
}

export async function saveRecentSearch({ role, query, routePath }) {
  if (!role || !routePath) return
  const api = getApi()
  await api.post('/search/recent', { role, query, routePath })
}
