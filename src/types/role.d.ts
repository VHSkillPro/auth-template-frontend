import { IBasePaginationParams } from './request';

/**
 * Represents a user role within the system.
 *
 * @property id - Unique identifier for the role.
 * @property name - Internal name of the role.
 * @property title - Display title of the role.
 * @property description - Detailed description of the role's purpose.
 * @property createdAt - Timestamp when the role was created.
 * @property updatedAt - Timestamp when the role was last updated.
 */
export interface IRole {
  id: string;
  name: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Parameters for paginating roles, extending the base pagination options.
 *
 * @remarks
 * Includes an optional keyword for filtering roles by search term.
 *
 * @property keyword - Optional search term to filter roles.
 */
export interface IRolePaginationParams extends IBasePaginationParams {
  keyword?: string;
}
