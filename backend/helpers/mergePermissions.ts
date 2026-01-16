import { IUserPermissions } from "../models/userModel";


export const mergePermissions = (
  base: IUserPermissions,
  incoming?: Partial<IUserPermissions>
): IUserPermissions => {
  const result: IUserPermissions = JSON.parse(JSON.stringify(base));

  if (!incoming) return result;

  for (const moduleKey of Object.keys(base) as (keyof IUserPermissions)[]) {
    if (!incoming[moduleKey]) continue;

    for (const actionKey of Object.keys(base[moduleKey])) {
      if (
        incoming[moduleKey] &&
        actionKey in incoming[moduleKey]!
      ) {
        (result[moduleKey] as any)[actionKey] =
          (incoming[moduleKey] as any)[actionKey];
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

  return result;
  return merged;

};
