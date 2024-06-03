import { UseAPI } from '../api'

interface EmailList {
    id: string;
    companyId: string;
    mailAddress: string;
    insertDataTime: string;
    insertUser: string;
    status: string;
    hashMailList: string;
  }

  export const emailComposables = () => {
    const api = new UseAPI()

    const createEmailList = async (data: EmailList) => {
        try {
          const resp = await api.post({
            endpoint: 'emailList',
            data,
            multipart: true
          })
          return resp
        } catch (error) {
          console.error(error)
          throw error
        }
      }
    
      return { createEmailList}
    }
    