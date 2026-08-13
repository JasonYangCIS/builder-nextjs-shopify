export interface CompareCardItem {
  image: string;
  imageAlt: string | null;
  label: string;
  productHandle: string | null;
  sidebarContent: string | null;
}

export interface CompareCardsProps {
  items: CompareCardItem[] | null;
}
