/**
 * Represents a permission entity with metadata.
 *
 * @property id - Unique identifier for the permission.
 * @property name - Internal name of the permission.
 * @property title - Display title of the permission.
 * @property createdAt - Timestamp when the permission was created.
 * @property updatedAt - Timestamp when the permission was last updated.
 */
export interface IPermission {
  id: string;
  name: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
