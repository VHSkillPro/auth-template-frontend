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
 * Represents the structure of errors returned in a bad request response.
 *
 * @property errors - An object where each key is the name of a field or parameter,
 * and the value is the corresponding error message.
 */
export interface IBadRequestErrors {
  errors: Record<string, string>;
}
