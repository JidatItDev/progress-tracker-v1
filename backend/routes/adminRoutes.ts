import pkg from "express";
import { createUserController, deleteUserController, getTeamMembers, getUsersController, updateUserController } from "../controllers/authControllers/userController";
import { loginController } from "../controllers/authControllers/authController";
import { loginValidation, updateUserProfileValidation } from "../middlewares/authValidators";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorize } from "../abac/authorize";
import { createProjectController, deleteProjectController, getProjectsController, updateProjectController } from "../controllers/projectControllers/projectController";
import { createMilestoneController, deleteMilestoneController, getMilestonesController, updateMilestoneController } from "../controllers/milestoneControllers/milestoneController";
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
    app.post('/admin/createUser', updateUserProfileValidation, authenticateToken, createUserController);

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


    app.put('/admin/updateUser/:id', updateUserProfileValidation, authenticateToken, updateUserController);

    app.patch('/admin/deleteUser/:id', authenticateToken, updateUserProfileValidation, authenticateToken, deleteUserController);

    app.get('/admin/getUsers', getUsersController);
    // app.get('/admin/getUsers', authenticateToken, getUsersController);

    app.get('/getTeamMembers', getTeamMembers);

    //auth routes:

    app.post('/login', updateUserProfileValidation, loginValidation, checkPermission("projects", "create"), loginController);

    // project routes

    app.post('/admin/createProject', authenticateToken, createProjectController);

    app.put('/admin/updateProject/:id', authenticateToken, updateProjectController);

    app.patch('/admin/deleteProject/:id', authenticateToken, deleteProjectController);

    app.get('/admin/getProjects', authenticateToken, getProjectsController);

    //milestone routes:

    app.post('/admin/createMilestone', authenticateToken, createMilestoneController);

    app.put('/admin/updateMilestone/:id', authenticateToken, updateMilestoneController);

    app.patch('/admin/deleteMilestone/:id', authenticateToken, deleteMilestoneController);

    app.get('/admin/getMilestones', authenticateToken, getMilestonesController);

    //submileston routes:
    app.post('/admin/createSubMilestone', authenticateToken, createSubMilestoneController);

    app.put('/admin/updateSubMilestone/:id', authenticateToken, updateSubMilestoneController);

    app.patch('/admin/deleteSubMilestone/:id', authenticateToken, deleteSubMilestoneController);

    app.get('/admim/getSubMilestones', authenticateToken, getSubMilestonesController);

    //delay routes:
    app.post('/admin/createDelay', authenticateToken, createDelayController);

    app.put('/admin/updateDelay/:id', authenticateToken, updateDelayController);

    app.patch('/admin/deleteDelay/:id', authenticateToken, deleteDelayController);

    app.get('/admin/getDelaysByMilstoneId/:id', authenticateToken, getDelaysByMilstoneIdController);

    //Project Dashboards:
    app.get('/admin/getProjectProgress/:id', authenticateToken, getProjectProgressController);
}