import { RequestHandler } from "express";
import { canAccess } from "./abac.policy";
import { Action, ResourceAttrs, SubjectAttrs } from "./abac.types";

type ResourceBuilder = (req: any) => ResourceAttrs;

export const authorize = (action: Action, buildResource: ResourceBuilder): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthenticated" });

    const subject: SubjectAttrs = {
      id: req.user.id,
      email: req.user.email ?? "",
      role: req.user.role,
      status: req.user.status,
    };

    const resource = buildResource(req);

    const ok = canAccess({ subject, action, resource });
    if (!ok) return res.status(403).json({ message: "Forbidden" });

    next();
  };
};
