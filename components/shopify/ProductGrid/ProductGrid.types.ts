export interface ProductGridProps {
  collectionHandle?: string | null;
  query?: string | null;
  limit?: number;
  heading?: string | null;
  /** Show a search / sort / filter toolbar above the grid, driven by facets Shopify returns for the current query. */
  enableControls?: boolean | null;
}
