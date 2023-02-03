const express = require('express');
const router = express.Router();
const { writeFile} = require('fs').promises;
const multer  = require('multer');
const upload = multer();

const {readProjectData, writeProjectData, findMembersIndex} = require('../utils/projectData')

const generateNewMemberId = (projectData)=>{
    const teamMembersCount = projectData.projectMembers.length;
    if (teamMembersCount === 0) {
        return 0;
    } else {
        return projectData.projectMembers[teamMembersCount - 1].memberId + 1;
    }
};
const generatePathToSaveNewMemberImage = (projectData, newMemberId, fileExtension)=> {
    return `./data/${projectData.projectId}/img/face_member_${newMemberId}.${fileExtension}`
};
const generatePathToUpdateMemberImage = (projectId, memberToEditId, newAvatarId, fileExtension) => {
    return `./data/${projectId}/img/face_member_${memberToEditId}_${newAvatarId}.${fileExtension}`
};
const generateNewMemberImageURL = (projectId, newMemberId, fileExtension) => {
    return `http://localhost:3636/getimage/${projectId}/face_member_${newMemberId}.${fileExtension}`
};
const generateUpdatedMemberImageURL = (projectId, memberToEditId, newAvatarId, fileExtension) => {
    return `http://localhost:3636/getimage/${projectId}/face_member_${memberToEditId}_${newAvatarId}.${fileExtension}`;
}
const generateAvatarId = (projectData, memberToEditIndex) => {
    let prevAvatarId;
    prevAvatarId = projectData.projectMembers[memberToEditIndex].memberImage_ID;
    if (prevAvatarId === undefined) {
        return 0;
    }
    return ++prevAvatarId;
};
const pushNewMemberToProjectData = (projectData, newMemberId,newMemberName, newMemberImageURL) => {
    const updatedProjectData = {...projectData}
    updatedProjectData.projectMembers.push({
        memberId: newMemberId,
        memberName: newMemberName,
        memberTasks: [],
        memberImageURL: newMemberImageURL,
    });
    return updatedProjectData;
};
const updateProjectMember = (projectData, memberToEditIndex, newMemberName, updatedMemberImageURL, newAvatarId) => {
    const updatedProjectData = {...projectData}
    updatedProjectData.projectMembers[memberToEditIndex].memberName = newMemberName;
    updatedProjectData.projectMembers[memberToEditIndex].memberImageURL = updatedMemberImageURL;
    updatedProjectData.projectMembers[memberToEditIndex].memberImage_ID = newAvatarId;
    return updatedProjectData;
};
const createResponseOK = (updatedMembers) => {
    return JSON.stringify({
        creationSuccess: true,
        projectMembers: updatedMembers,
    })
};
const createResponseNotOK = () => {
    return JSON.stringify({
        creationSuccess: false,
        message: "Something went wrong. Please try again later.",
    })
};


router.post('/', upload.single('avatar'), async (req, res) => {
    const {mode, projectId, fileExtension, memberName, memberToEditId} = req.body;


    if (mode === "create") {
        try {
            const projectData = await readProjectData(projectId);
            const newMemberId = generateNewMemberId(projectData);
            const pathToSaveImage = generatePathToSaveNewMemberImage(projectData, newMemberId, fileExtension);
            await writeFile(pathToSaveImage, req.file.buffer);
            const newMemberImageURL = generateNewMemberImageURL(projectId, newMemberId, fileExtension);
            const updatedProjectData = pushNewMemberToProjectData(projectData, newMemberId, memberName, newMemberImageURL);
            await writeProjectData(projectId, updatedProjectData);
            const response = createResponseOK(updatedProjectData.projectMembers);
            res.send(response)
        } catch (e) {
            const response = createResponseNotOK();
            console.log(e);
            res.send(response)
        }
    }
    if (mode === "edit") {

        try {
            const projectData = await readProjectData(projectId);
            const memberToEditIndex = findMembersIndex(projectData, memberToEditId);
            const newAvatarId = generateAvatarId(projectData, memberToEditIndex);
            const updatedMemberImageURL = generateUpdatedMemberImageURL(projectId, memberToEditId, newAvatarId, fileExtension);
            const updatedProjectData = updateProjectMember(projectData, memberToEditIndex, memberName, updatedMemberImageURL, newAvatarId);
            await writeProjectData(projectId, updatedProjectData);
            const pathToUpdateMemberImage = generatePathToUpdateMemberImage(projectId, memberToEditIndex, newAvatarId, fileExtension);
            await writeFile(pathToUpdateMemberImage, req.file.buffer)
            const response = createResponseOK(updatedProjectData.projectMembers);
            res.send(response)
        } catch (e) {
            const response = createResponseNotOK(e.message);
            res.send(response)
        }

    }
    if (mode !== "edit" && mode !== "create") {
        const response = createResponseNotOK();
        res.send(response)
    }
});


module.exports = router;
