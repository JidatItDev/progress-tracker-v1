import { IUserPermissions } from "../models/userModel";


export const mergePermissions = (
  base: IUserPermissions,
  incoming?: Partial<IUserPermissions>
): IUserPermissions => {
  if (!incoming) return base;

  const merged: IUserPermissions = JSON.parse(JSON.stringify(base));

  for (const moduleKey in incoming) {
    if (!merged[moduleKey as keyof IUserPermissions]) continue;

    for (const actionKey in incoming[moduleKey as keyof IUserPermissions]) {
      if (actionKey in merged[moduleKey as keyof IUserPermissions]) {
        merged[moduleKey as keyof IUserPermissions][actionKey] =
          incoming[moduleKey as keyof IUserPermissions]?.[actionKey] ?? false;
      }
    }
  }

  return merged;
};
