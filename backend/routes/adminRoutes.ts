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
const express = pkg;
type Application = pkg.Application;
type Request = pkg.Request;
type Response = pkg.Response;


export default (app: Application): void => {

    //create User routes:
    app.post('/admin/createUser', updateUserProfileValidation, createUserController);

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


    app.put('/admin/updateUser/:id', updateUserProfileValidation, updateUserController);

    app.patch('/admin/deleteUser/:id', authenticateToken, updateUserProfileValidation, deleteUserController);

    app.get('/admin/getUsers', getUsersController);

    app.get('/getTeamMembers', getTeamMembers);

    //auth routes:

    app.post('/login', updateUserProfileValidation, loginValidation, loginController);

    // project routes

    app.post('/admin/createProject', createProjectController);

    app.put('/admin/updateProject/:id', updateProjectController);

    app.patch('/admin/deleteProject/:id', deleteProjectController);

    app.get('/admin/getProjects', getProjectsController);

    //milestone routes:

    app.post('/admin/createMilestone', createMilestoneController);

    app.put('/admin/updateMilestone/:id', updateMilestoneController);

    app.patch('/admin/deleteMilestone/:id', deleteMilestoneController);

    app.get('/admin/getMilestones', getMilestonesController);

    //submileston routes:
    app.post('/admin/createSubMilestone', createSubMilestoneController);

    app.put('/admin/updateSubMilestone/:id', updateSubMilestoneController);

    app.patch('/admin/deleteSubMilestone/:id', deleteSubMilestoneController);

    app.get('/admim/getSubMilestones', getSubMilestonesController);

    //delay routes:
    app.post('/admin/createDelay', createDelayController);

    app.put('/admin/updateDelay/:id', updateDelayController);

    app.patch('/admin/deleteDelay/:id', deleteDelayController);

    app.get('/admin/getDelaysByMilstoneId/:id', getDelaysByMilstoneIdController);

    //Project Dashboards:
    app.get('/admin/getProjectProgress/:id', getProjectProgressController);
}