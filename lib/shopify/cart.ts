import "server-only";
import { shopifyFetch } from "./storefront-client";
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
  CART_LINES_UPDATE,
  CART_DISCOUNT_CODES_UPDATE,
  CART_BUYER_IDENTITY_UPDATE,
  GET_CART,
} from "./queries/cart";
import type { Cart, CartLine, UserError } from "./types";

interface RawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: Cart["cost"];
  discountCodes: Cart["discountCodes"];
  discountAllocations: Cart["discountAllocations"];
  lines: { edges: { node: CartLine }[] };
}

interface CartMutationResult {
  cart: RawCart | null;
  userErrors: UserError[];
}

function normalize(cart: RawCart | null): Cart | null {
  if (!cart) return null;
  return { ...cart, lines: cart.lines.edges.map((e) => e.node) };
}

export async function createCart(): Promise<{ cart: Cart | null; userErrors: UserError[] }> {
  const { data } = await shopifyFetch<{ cartCreate: CartMutationResult }>({
    query: CART_CREATE,
    variables: {},
    revalidate: false,
  });
  return { cart: normalize(data.cartCreate.cart), userErrors: data.cartCreate.userErrors };
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const { data } = await shopifyFetch<{ cart: RawCart | null }>({
    query: GET_CART,
    variables: { id: cartId },
    revalidate: false,
  });
  return normalize(data.cart);
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
) {
  const { data } = await shopifyFetch<{ cartLinesAdd: CartMutationResult }>({
    query: CART_LINES_ADD,
    variables: { cartId, lines },
    revalidate: false,
  });
  return { cart: normalize(data.cartLinesAdd.cart), userErrors: data.cartLinesAdd.userErrors };
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
) {
  const { data } = await shopifyFetch<{ cartLinesUpdate: CartMutationResult }>({
    query: CART_LINES_UPDATE,
    variables: { cartId, lines },
    revalidate: false,
  });
  return { cart: normalize(data.cartLinesUpdate.cart), userErrors: data.cartLinesUpdate.userErrors };
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const { data } = await shopifyFetch<{ cartLinesRemove: CartMutationResult }>({
    query: CART_LINES_REMOVE,
    variables: { cartId, lineIds },
    revalidate: false,
  });
  return { cart: normalize(data.cartLinesRemove.cart), userErrors: data.cartLinesRemove.userErrors };
}

export async function updateDiscountCodes(cartId: string, discountCodes: string[]) {
  const { data } = await shopifyFetch<{ cartDiscountCodesUpdate: CartMutationResult }>({
    query: CART_DISCOUNT_CODES_UPDATE,
    variables: { cartId, discountCodes },
    revalidate: false,
  });
  return {
    cart: normalize(data.cartDiscountCodesUpdate.cart),
    userErrors: data.cartDiscountCodesUpdate.userErrors,
  };
}

export async function updateBuyerIdentity(cartId: string, customerAccessToken: string) {
  const { data } = await shopifyFetch<{ cartBuyerIdentityUpdate: CartMutationResult }>({
    query: CART_BUYER_IDENTITY_UPDATE,
    variables: { cartId, buyerIdentity: { customerAccessToken } },
    revalidate: false,
  });
  return {
    cart: normalize(data.cartBuyerIdentityUpdate.cart),
    userErrors: data.cartBuyerIdentityUpdate.userErrors,
  };
}
