import jwt from 'jsonwebtoken';

export function getTokenDecoded(): any {
  if (typeof document == 'undefined') return null;

  const token: any = document.cookie
    .split('; ')
    .find((row) => row.startsWith('unsisToken='))
    ?.split('=')[1];

  const decodedToken = jwt.decode(token);

  return decodedToken;
}

export function getToken(): string | null {
  if (typeof document == 'undefined') return null;

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('unsisToken='))
    ?.split('=')[1];

  return token || null;
}
