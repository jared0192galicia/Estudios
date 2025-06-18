export const baseAPI =
  process.env.NODE_ENV == 'production'
    ? 'api'
    : 'http://localhost:3001';

export const environment =
  process.env.NODE_ENV == 'production' ? 'production' : 'development';
