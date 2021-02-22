
export const AUTH_TOKEN_KEY = 'AUTH_TOKEN';
export const EXPIRATION_KEY = 'EXPIRES_AT';

export const LOGIN_ERROR_CODES = new Set([400, 401]);

export const UNSUCCESSFUL_LOGIN: { accessToken: string, expiresIn: 0 } = {
  accessToken: '',
  expiresIn: 0,
};
