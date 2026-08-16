import type { SquareClient } from 'square';
import { parseSquareError } from '../errors.js';

/**
 * A Square location (a merchant's business location).
 *
 * A location's `currency` is the currency Square processes all of that
 * location's transactions in — useful for deriving the right currency instead
 * of hardcoding or configuring it.
 */
export interface Location {
  id?: string;
  /** Location nickname shown in the Seller Dashboard */
  name?: string | null;
  /** Two-letter ISO 3166 country code, e.g. `US`, `CA` */
  country?: string;
  /** ISO 4217 currency code, e.g. `USD`, `CAD` */
  currency?: string;
  /** Location status, e.g. `ACTIVE` or `INACTIVE` */
  status?: string;
}

/**
 * Locations service for reading a merchant's Square locations.
 *
 * @example
 * ```typescript
 * // Derive the merchant's currency instead of configuring it
 * const [location] = await square.locations.list();
 * const currency = location?.currency; // e.g. 'CAD'
 * ```
 */
export class LocationsService {
  constructor(private readonly client: SquareClient) {}

  /**
   * List all locations for the merchant.
   *
   * The Square Locations API is not paginated — every location is returned.
   *
   * @returns Array of locations
   *
   * @example
   * ```typescript
   * const locations = await square.locations.list();
   * ```
   */
  async list(): Promise<Location[]> {
    try {
      const response = await this.client.locations.list();
      return response.locations ?? [];
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a single location by ID.
   *
   * @param locationId - Location ID
   * @returns The location
   *
   * @example
   * ```typescript
   * const location = await square.locations.get('LXXX');
   * console.log(location.currency); // 'CAD'
   * ```
   */
  async get(locationId: string): Promise<Location> {
    try {
      const response = await this.client.locations.get({ locationId });

      if (!response.location) {
        throw new Error('Location not found');
      }

      return response.location;
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
