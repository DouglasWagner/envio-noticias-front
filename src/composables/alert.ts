import Swal from 'src/boot/swal'
import { AlertParameters, AlertQuestionParameters } from 'src/models'

export function useAlert() {
  const alertSuccess = async ({ title, text }: AlertParameters) => {
    await Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#062b68'
    })
  }
  const alertError = async ({ title, text }: AlertParameters) => {
    await Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#062b68'
    })
  }
  const alertInfo = async ({ title, text }: AlertParameters) => {
    await Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonColor: '#062b68'
    })
  }
  const alertWarning = async ({ title, text }: AlertParameters) => {
    await Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonColor: '#062b68'
    })
  }
  const alertQuestion = async ({
    title,
    text,
    confirmCallBack
  }: AlertQuestionParameters) => {
    await Swal.fire({
      title,
      icon: 'question',
      html: `<span>${text ?? ''}</span>`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Submeter',
      reverseButtons: true,
      cancelButtonColor: '#8E9093',
      confirmButtonColor: '#C62E2E',
      customClass: {
        confirmButton: 'text-white border border-dark'
      },
      focusConfirm: false
    }).then(async (result) => {
      if (result.isConfirmed) await confirmCallBack()
    })
  }

  return {
    alertSuccess,
    alertError,
    alertInfo,
    alertWarning,
    alertQuestion
  }
}
