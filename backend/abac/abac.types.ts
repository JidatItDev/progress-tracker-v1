import { UserRole } from "../models/userModel";

export type Action = "create" | "read" | "update" | "delete" | "list";

export interface SubjectAttrs {
  id: string;
  email: string;
  role: UserRole;
  status: "Y" | "N";
}

export type ResourceKind = "User";

export interface UserResourceAttrs {
  kind: "User";
  id?: string;
  ownerId?: string; 
  status?: "Y" | "N";
}

export type ResourceAttrs = UserResourceAttrs;

export interface AbacContext {
  subject: SubjectAttrs;
  action: Action;
  resource: ResourceAttrs;
}
