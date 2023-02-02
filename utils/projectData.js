const {readFile, writeFile} = require('fs').promises;

const readProjectData =async (projectId) => {
    const projectDataJSON = await readFile(`./data/${projectId}/data.json`);
    const projectData = JSON.parse(projectDataJSON);
    return projectData;
}

const writeProjectData =async (projectId, projectData) => {
    await writeFile(`./data/${projectId}/data.json`, JSON.stringify(projectData));
}

const findMembersIndex = (projectData, memberId) => {
    return projectData.projectMembers.findIndex(member => member.memberId === parseInt(memberId))
}


module.exports = {readProjectData, writeProjectData, findMembersIndex}
