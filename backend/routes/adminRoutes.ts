import pkg from "express";
import { createUserController, deleteUserController, getTeamMembers, getUsersController, updateUserController } from "../controllers/authControllers/userController";
import { loginController } from "../controllers/authControllers/authController";
import { loginValidation, updateUserProfileValidation } from "../middlewares/authValidators";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorize } from "../abac/authorize";
import { createProjectController, deleteProjectController, getProjectsController, updateProjectController } from "../controllers/projectControllers/projectController";
import { createMilestoneController, deleteMilestoneController, getMilestonesByIdController, getMilestonesController, updateMilestoneController } from "../controllers/milestoneControllers/milestoneController";
import { createSubMilestoneController, deleteSubMilestoneController, getSubMilestonesController, updateSubMilestoneController } from "../controllers/subsmilestoneControllers/submilestoneController";
import { createDelayController, deleteDelayController, getDelaysByMilstoneIdController, updateDelayController } from "../controllers/delayControllers/delayController";
import { getProjectProgressController } from "../controllers/projectDashboardControllers/progressTrackerController";
import { checkPermission } from "../middlewares/permissionMiddleware";
const express = pkg;
type Application = pkg.Application;
type Request = pkg.Request;
type Response = pkg.Response;


export default (app: Application): void => {

    //create User routes:
    app.post('/admin/createUser', updateUserProfileValidation, authenticateToken, checkPermission("users", "create"), createUserController);

    // app.post(
    // "/admin/createUser",
    // authorize("write", async (req) => ({
    //     type: "user",
    //     createRole: req.body.role,
    // }) as any),
    // createUserController
    // );

    app.get(
    "/users",
    authorize("list", () => ({ kind: "User" })),
    async (req, res) => {
        getUsersController
        res.json([]);
    }
    );


    app.put('/admin/updateUser/:id', updateUserProfileValidation, authenticateToken, checkPermission("users", "update"), updateUserController);

    app.patch('/admin/deleteUser/:id', authenticateToken, updateUserProfileValidation, authenticateToken, checkPermission("users", "delete"), deleteUserController);

    app.get('/admin/getUsers', authenticateToken, checkPermission("users", "view"), getUsersController);
    // app.get('/admin/getUsers', authenticateToken, getUsersController);

    app.get('/getTeamMembers', getTeamMembers);

    //auth routes:

    app.post('/login', updateUserProfileValidation, loginValidation, loginController);

    // project routes

    app.post('/admin/createProject', authenticateToken, checkPermission("projects", "create"), createProjectController);

    app.put('/admin/updateProject/:id', authenticateToken, checkPermission("projects", "update"), updateProjectController);

    app.patch('/admin/deleteProject/:id', authenticateToken, checkPermission("projects", "delete"), deleteProjectController);

    app.get('/admin/getProjects', authenticateToken, checkPermission("projects", "view"), getProjectsController);

    //milestone routes:

    app.post('/admin/createMilestone', authenticateToken, checkPermission("milestones", "create"), createMilestoneController);

    app.put('/admin/updateMilestone/:id', authenticateToken, checkPermission("milestones", "update"), updateMilestoneController);

    app.patch('/admin/deleteMilestone/:id', authenticateToken, checkPermission("milestones", "delete"), deleteMilestoneController);

    app.get('/admin/getMilestones', authenticateToken, checkPermission("milestones", "view"), getMilestonesController);

    app.get('/admin/getMilestonesById/:id', authenticateToken, checkPermission("milestones", "view"), getMilestonesByIdController);

    //submileston routes:
    app.post('/admin/createSubMilestone', authenticateToken, checkPermission("submilestones", "create"), createSubMilestoneController);

    app.put('/admin/updateSubMilestone/:id', authenticateToken, checkPermission("submilestones", "update"), updateSubMilestoneController);

    app.patch('/admin/deleteSubMilestone/:id', authenticateToken, checkPermission("submilestones", "delete"), deleteSubMilestoneController);

    app.get('/admin/getSubMilestones', authenticateToken, checkPermission("submilestones", "view"), getSubMilestonesController);

    //delay routes:
    app.post('/admin/createDelay', authenticateToken, checkPermission("delay", "create"), createDelayController);

    app.put('/admin/updateDelay/:id', authenticateToken, checkPermission("delay", "update"), updateDelayController);

    app.patch('/admin/deleteDelay/:id', authenticateToken, checkPermission("delay", "delete"), deleteDelayController);

    app.get('/admin/getDelaysByMilstoneId/:id', authenticateToken, checkPermission("delay", "view"), getDelaysByMilstoneIdController);

    //Project Dashboards:
    app.get('/admin/getProjectProgress/:id', authenticateToken, checkPermission("overview", "view"), getProjectProgressController);
}