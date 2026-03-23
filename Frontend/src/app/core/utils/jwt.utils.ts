export interface JwtPayload {
  sub: string;
  name: string;
  role: string;
  userId: string;
  builderId: string;
  exp: number;
  iat: number;
}

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const NAME_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

let cachedPayload: JwtPayload | null = null;
let cachedToken: string | null = null;

export function parseJwt(token: string | null): JwtPayload | null {
  if (!token) return null;

  // Return cached result if token hasn't changed
  if (token === cachedToken && cachedPayload) return cachedPayload;

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const raw = JSON.parse(atob(base64));

    cachedPayload = {
      sub: raw[NAME_ID_CLAIM] || raw.sub || '',
      name: raw[NAME_CLAIM] || raw.unique_name || '',
      role: raw[ROLE_CLAIM] || raw.role || '',
      userId: raw['UserId'] || raw[NAME_ID_CLAIM] || '0',
      builderId: raw['BuilderId'] || '0',
      exp: raw.exp || 0,
      iat: raw.iat || 0
    };
    cachedToken = token;
    return cachedPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null): boolean {
  const payload = parseJwt(token);
  if (!payload) return true;
  return payload.exp < Math.floor(Date.now() / 1000);
}

export function clearJwtCache(): void {
  cachedPayload = null;
  cachedToken = null;
}
