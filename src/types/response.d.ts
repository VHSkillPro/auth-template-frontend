/**
 * Represents a standard API response structure.
 *
 * @property success Indicates whether the API request was successful.
 * @property message A descriptive message about the API response.
 */
export interface IApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

/**
 * Represents an API response that includes a data payload of type `T`.
 *
 * @template T - The type of the data returned in the response.
 * @extends IApiResponse
 * @property {T} data - The data returned from the API.
 */
export interface IDataApiResponse<T> extends IApiResponse {
  data: T;
}

/**
 * Metadata information for paginated API responses.
 *
 * @property page - The current page number.
 * @property size - The number of items per page.
 * @property total - The total number of items available.
 * @property pages - The total number of pages available.
 * @property sort - The sorting criteria applied to the results.
 */
export interface IPageableMetaResponse {
  page: number;
  size: number;
  total: number;
  pages: number;
  sort: string;
}

/**
 * Represents a paged API response structure.
 *
 * @template T The type of items contained in the response data array.
 * @extends IApiResponse
 * @property {T[]} data - The array of items returned by the API.
 * @property {IPageableMetaResponse} meta - Metadata about the pagination, such as page number and total count.
 */
export interface IPagedApiResponse<T> extends IApiResponse {
  data: T[];
  meta: IPageableMetaResponse;
}

/**
 * Represents the structure of errors returned in a bad request response.
 *
 * @property errors - An object where each key is the name of a field or parameter,
 * and the value is the corresponding error message.
 */
export interface IBadRequestErrors {
  errors: Record<string, string>;
}
