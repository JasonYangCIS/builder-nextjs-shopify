export interface SelectedHandle {
  shopifyProductHandle: string | null;
}

export interface ProductGridSelectedProps {
  handles?: SelectedHandle[] | null;
  heading?: string | null;
}
