type Input<T = unknown> = T

export type APIParams = {
  endpoint: string
  data?: Input
  multipart?:boolean
  params?: Input
}
