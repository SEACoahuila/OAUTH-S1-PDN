import { object, string, number, date, InferType } from 'yup';

export interface RefreshToken {
  grant_type: string;
  refresh_token: string;
}

export interface Token {
  grant_type: string;
  username: string;
  password: string;
  scope?: string;
  client_secret: string;
  client_id: string;
}

export const tokenSchema = object({
  grant_type: string().required('grant_type es requerido.'),
  username: string().required('username es requerido.'),
  password: string().required('password es requerido.'),
  scope: string(),
  client_id: string().required('client_id es requerido.'),
  client_secret: string().required('client_secret es requerido.'),
});

export const refreshTokenSchema = object({
  grant_type: string().required('grant_type es requerido.'),
  refresh_token: string().required('refresh_token es requerido.')
})