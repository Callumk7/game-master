export type Id = string;

type SuccessfulResponse<T> = { success: true; data: T };
type Unsuccessfulresponse = { success: false; message: string };
export type ServerResponse<T> = SuccessfulResponse<T> | Unsuccessfulresponse;
