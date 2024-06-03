export function appSession<T>() {
  const set = (key: string, value?: string | object) => {
    if (!value) {
      console.error('Session item value is blank')
      return
    }
    const content = typeof value === 'object' ? JSON.stringify(value) : value
    window.sessionStorage.setItem(key, content)
  }
  const get = (key: string): T =>
    JSON.parse(window.sessionStorage.getItem(key) as string) as T
  return {
    get,
    set
  }
}
