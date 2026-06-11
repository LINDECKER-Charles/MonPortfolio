/* Agrégateur rétrocompatible : les types vivent dans `projects.types.ts` et les
   données dans `projects.data.ts`. Les consommateurs existants continuent
   d'importer depuis `projects.state` sans modification. */
export * from './projects.types';
export * from './projects.data';
