import { useAlert } from 'src/composables'

const { alertSuccess, alertError } = useAlert()

export const alertUpdated = async (message?: string): Promise<void> =>
  await alertSuccess({
    title: 'Sucesso',
    text: message ?? 'Registro salvo com sucesso'
  })

export const alertErrors = async (
  text: string,
  title = 'Erro'
): Promise<void> => await alertError({ title, text })
