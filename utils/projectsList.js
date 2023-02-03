const {readFile, writeFile} = require('fs').promises;
const PROJECTS_LIST_FILE = './data/projectsList.json'

const readProjectsList =async () => {
    const projectsListDataFromFile = await readFile(PROJECTS_LIST_FILE, 'utf8');
    return JSON.parse(projectsListDataFromFile);
}

const writeProjectsList = async (newProjectsList) => {
    const newProjectsListJSON = JSON.stringify(newProjectsList);
    await writeFile(PROJECTS_LIST_FILE, newProjectsListJSON);
}

const checkProjectId = async (projectsList, requestedId) => {
    if (projectsList.some(project => project.projectId === requestedId)) {
        return {projectDoesntExist: false, message: "Project exists"};
    }
    return {projectDoesntExist: true, message: "There is no project under such ID"};
}


module.exports = {readProjectsList, writeProjectsList, checkProjectId}
