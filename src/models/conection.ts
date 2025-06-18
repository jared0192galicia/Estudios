export const baseAPI =
  process.env.NODE_ENV == 'production'
    ? 'https://132.18.53.133:3001'
    : 'http://localhost:3001';

export const environment =
  process.env.NODE_ENV == 'production' ? 'production' : 'development';
