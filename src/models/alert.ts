export type AlertParameters = {
  title?: string;
  text?: string;
}
export type AlertQuestionParameters = {
  title?: string
  text?: string
  confirmCallBack(): Promise<void>
}
