export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  options: { name: string; values: string[] }[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  variants: ProductVariant[];
  tags: string[];
  productType: string;
  availableForSale: boolean;
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: Money; subtotalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    image: ShopifyImage | null;
    product: { handle: string; title: string };
    selectedOptions: { name: string; value: string }[];
    availableForSale: boolean;
    quantityAvailable: number | null;
  };
}

export interface DiscountCode {
  code: string;
  applicable: boolean;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
    totalDutyAmount: Money | null;
  };
  lines: CartLine[];
  discountCodes: DiscountCode[];
  discountAllocations: { discountedAmount: Money }[];
}

export interface UserError {
  field: string[] | null;
  message: string;
  code?: string | null;
}
