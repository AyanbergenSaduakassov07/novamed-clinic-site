/**
 * Clinic photography.
 *
 * Empty on purpose. The client has not supplied photographs yet, and shipping
 * stock images of a clinic that is not this clinic would misrepresent it. While
 * this array is empty every gallery surface renders the "photos coming, see
 * Instagram" state instead, which is true and still gives the visitor
 * somewhere to look.
 *
 * TO POPULATE: drop files in /public/gallery and add entries here. `alt` is
 * required and should describe the room, not the brand.
 */
export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const GALLERY: readonly Photo[] = [];
