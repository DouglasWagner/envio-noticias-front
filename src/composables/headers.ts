import { useAuth } from 'src/stores/data'

export function useHeaders() {
  const bearer = (multipart = false) => {
    
    return {
      headers: {
        Authorization: useAuth().accessToken,
        Accept: 'application/json',
        ContentType: multipart ? 'multipart/form-data' : 'application/json'
      }
    }
  }

  return { bearer }
}
