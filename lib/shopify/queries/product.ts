export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    productType
    options { name values }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    featuredImage { url altText width height }
    images(first: 10) {
      edges { node { url altText width height } }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
`;

// The root `products` field (2024-10 Storefront API) does not accept a
// `filters` argument — only `Collection.products` does. It still exposes the
// `filters` facet field so the UI can show available facets, but applying a
// facet only works once a collection is selected.
export const LIST_PRODUCTS = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query ListProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges { node { ...ProductFields } }
      filters { id label type values { id label count input } }
    }
  }
`;

export const LIST_PRODUCT_HANDLES = /* GraphQL */ `
  query ListProductHandles($first: Int!) {
    products(first: $first) { edges { node { handle } } }
  }
`;
