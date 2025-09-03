/**
 * Represents the basic parameters for paginated requests.
 *
 * @property page - The current page number (optional).
 * @property size - The number of items per page (optional).
 * @property sort - The sorting criteria in string format (optional).
 */
export interface IBasePaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}
