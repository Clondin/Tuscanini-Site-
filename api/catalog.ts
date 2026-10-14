import { catalogResponse } from '../server/kayco-catalog.js';

// Web-standard method handlers (Vercel Node.js runtime). Other methods get a 405 from the platform.
export function GET(): Promise<Response> {
  return catalogResponse('GET');
}

export function HEAD(): Promise<Response> {
  return catalogResponse('HEAD');
}
