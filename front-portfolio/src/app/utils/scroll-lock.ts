/** Verrou de scroll partagé par les overlays (modals, lightbox). */

/**
 * Fige le scroll de la page (`overflow: hidden` sur le body) et renvoie la
 * fonction de restauration. La valeur précédente est capturée puis restaurée
 * telle quelle : des overlays imbriqués (lightbox au-dessus d'un modal) se
 * déverrouillent en ordre LIFO sans écraser le verrou de l'overlay parent.
 */
export function lockBodyScroll(doc: Document): () => void {
  const previousOverflow = doc.body.style.overflow;
  doc.body.style.overflow = 'hidden';

  return () => {
    doc.body.style.overflow = previousOverflow;
  };
}
