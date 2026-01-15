import { AbacContext } from "./abac.types";
import { UserRole } from "../models/userModel";

export const canAccess = (ctx: AbacContext): boolean => {
  const { subject, action, resource } = ctx;

  // Global deny if subject disabled
  if (subject.status === "N") return false;

  // Admin can do everything
  if (subject.role === UserRole.ADMIN) return true;

  // For now: TEAM + CLIENT can read/list users (testing purpose)
  if (resource.kind === "User") {
    if (action === "list") return true; // user list
    if (action === "read") return true; // allow reading a single user for now
    return false; // block create/update/delete for non-admin
  }

  return false;
};
