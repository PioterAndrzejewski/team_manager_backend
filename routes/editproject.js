const express = require('express');
const router = express.Router();
const {rm} = require('fs').promises;
const {dirname} = require('path');
const multer  = require('multer');
const getFile = multer();

const safeJoin = require('../utils/safeJoin')
const {readProjectsList, writeProjectsList} = require('../utils/projectsList')
const {readProjectData, writeProjectData} = require('../utils/projectData')

const removeProjectFromList = (projectsList, projectId) => {
    return projectsList.filter(project => project.projectId !== parseInt(projectId));
}
const removeProjectDirectory = async (projectId) => {
    const projectPath = safeJoin(dirname(__dirname), `./data/${projectId}/`);
    await rm(projectPath, { recursive: true, force: true });
}
const updateProjectsList = (projectsList, projectId, newProjectName) => {
    return projectsList.map(project => {
        if (project.projectId === projectId) {
            project.projectName = newProjectName;
        }
        return project;
    });
}
const updateProjectData = (projectData, newProjectName) => {
    const updatedProjectData = { ...projectData };
    updatedProjectData.projectName = newProjectName;
    return updatedProjectData;
}


router.post('/', getFile.none(), async (req, res) => {
    const {newProjectName, projectId} = req.body;
    let response;
    const projectsList = await readProjectsList();

    if(req.body.mode === "remove") {
        const updatedProjectsList = removeProjectFromList(projectsList, projectId);
        await removeProjectDirectory(projectId)
        await writeProjectsList(updatedProjectsList);
        response = JSON.stringify({
            success: true,
            action: "remove",
        })
    }
    if(req.body.mode === "edit") {
        const updatedProjectsList = updateProjectsList(projectsList, projectId, newProjectName);
        await writeProjectsList(updatedProjectsList);
        const projectData = await readProjectData(projectId);
        const updatedProjectData = updateProjectData(projectData, newProjectName)
        await writeProjectData(projectId, updatedProjectData);
        response = JSON.stringify({
            success: true,
            action: "edit",
            newProjectName: newProjectName,
        })
    }


    res.end(response)
});
module.exports = router;





