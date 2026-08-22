import { ENV } from '../environments/env';

/**
 * Headers de sécurité émis par le serveur SSR (anciennement posés par le vhost
 * Apache) — l'application les porte elle-même : identiques derrière tout proxy,
 * testés en e2e, et la CSP suit IMAGE_SERVER_URL au lieu d'être dupliquée côté infra.
 */
export interface SecurityHeadersOptions {
  /** Requête reçue en HTTPS (derrière le proxy : X-Forwarded-Proto) → HSTS + upgrade. */
  readonly secure: boolean;
  /** Environnement non indexable (staging) → X-Robots-Tag. */
  readonly noindex: boolean;
}

/** Embed vidéo YouTube de la modale projets — sinon `frame-src 'none'`. */
const YOUTUBE_FRAMES = 'https://www.youtube-nocookie.com https://www.youtube.com';

/** Origine externe du serveur d'images si le préfixe est absolu (dev docker) ; vide sinon. */
export function imageServerOrigin(imageServerUrl: string): string {
  try {
    return new URL(imageServerUrl).origin;
  } catch {
    return '';
  }
}

/**
 * CSP stricte : aucun script inline (app prérendue → zéro nonce/hash requis).
 * 'unsafe-inline' conservé uniquement sur style-src (styles composants Angular +
 * attributs style). upgrade-insecure-requests seulement en HTTPS : en dev HTTP il
 * forcerait le nginx images local (http://localhost:8081) en https.
 */
export function contentSecurityPolicy(
  secure: boolean,
  imageServerUrl = ENV.imageServerUrl,
): string {
  const imgOrigin = imageServerOrigin(imageServerUrl);
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob:${imgOrigin ? ` ${imgOrigin}` : ''}`,
    "font-src 'self'",
    "connect-src 'self'",
    `frame-src ${YOUTUBE_FRAMES}`,
    "frame-ancestors 'none'",
    "form-action 'self'",
  ];
  if (secure) {
    directives.push('upgrade-insecure-requests');
  }
  return directives.join('; ');
}

export function securityHeaders(
  options: SecurityHeadersOptions,
  imageServerUrl = ENV.imageServerUrl,
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Security-Policy': contentSecurityPolicy(options.secure, imageServerUrl),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '0',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
  if (options.secure) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }
  if (options.noindex) {
    headers['X-Robots-Tag'] = 'noindex, nofollow';
  }
  return headers;
}
