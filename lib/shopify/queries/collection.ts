import { PRODUCT_FRAGMENT } from "./product";

export const GET_COLLECTION = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query GetCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      image { url altText width height }
      products(first: $first) { edges { node { ...ProductFields } } }
    }
  }
`;

export const LIST_COLLECTION_HANDLES = /* GraphQL */ `
  query ListCollectionHandles($first: Int!) {
    collections(first: $first) { edges { node { handle } } }
  }
`;
