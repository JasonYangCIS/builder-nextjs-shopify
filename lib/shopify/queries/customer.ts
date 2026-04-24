/** Customer Account API GraphQL queries (called against the Customer Account API endpoint). */
export const CUSTOMER_PROFILE = /* GraphQL */ `
  query CustomerProfile {
    customer {
      id
      firstName
      lastName
      emailAddress { emailAddress }
    }
  }
`;

export const CUSTOMER_ORDERS = /* GraphQL */ `
  query CustomerOrders($first: Int!) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice { amount currencyCode }
          }
        }
      }
    }
  }
`;
