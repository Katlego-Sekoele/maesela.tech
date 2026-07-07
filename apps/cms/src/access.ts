import type { Access } from 'payload'

/** Anyone (including unauthenticated visitors) may read. */
export const anyone: Access = () => true

/** Only authenticated admin users may perform the operation. */
export const adminOnly: Access = ({ req }) => Boolean(req.user)
