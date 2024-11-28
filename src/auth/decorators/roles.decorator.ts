import { SetMetadata } from '@nestjs/common';

// Define a key for the metadata
export const ROLES_KEY = 'roles';

// Create the Roles decorator that will store roles in metadata
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
