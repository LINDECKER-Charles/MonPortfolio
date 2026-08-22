import { GENERATED_ENV } from './env.generated';

/**
 * Configuration build-time de l'application, injectée depuis le `.env` racine
 * par `scripts/gen-env.mjs` (hooks npm postinstall/prebuild/prestart/pretest).
 *
 * Ne pas importer `env.generated.ts` directement : cette façade est le point
 * de consommation stable (et le seul endroit à adapter si le mécanisme change).
 */
export interface AppEnv {
  /** Origine publique canonique du site (sans slash final). */
  readonly siteUrl: string;
  /** Préfixe des images : chemin absolu `/img` (prod, dev) ou origine http(s) externe — sans slash final. */
  readonly imageServerUrl: string;
}

export const ENV: AppEnv = GENERATED_ENV;
