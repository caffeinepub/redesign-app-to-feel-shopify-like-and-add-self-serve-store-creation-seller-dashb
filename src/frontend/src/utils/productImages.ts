import { Product, ExternalBlob } from '../backend';
import { ASSETS } from './assets';

/**
 * Get the primary image URL for a product
 * Returns the first image's direct URL if available, otherwise returns placeholder
 */
export function getProductImageUrl(product: Product): string {
  if (product.images && product.images.length > 0) {
    return product.images[0].getDirectURL();
  }
  return ASSETS.productPlaceholder;
}

/**
 * Get image URL for a cart item
 * Supports both stored image URLs and fallback to placeholder
 */
export function getCartItemImageUrl(imageUrl?: string): string {
  return imageUrl || ASSETS.productPlaceholder;
}
