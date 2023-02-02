

<!-- PROJECT LOGO -->
<p align="center">

<img src="https://user-images.githubusercontent.com/109315248/216438997-36ea03a5-6de8-467e-af10-c6a0ffe0f402.png" alt="Team Manager logo"> 

  
  
</p>
<h3 align="center">Team Manager</h3>

  <p align="center">
    Team Manager - backend
    <br />
    <a href="https://pioterandrzejewski.github.io/Portfolio-app/">View Demo</a>
  </p>
</div>

## Getting started

After cloning the repository and installing dependencies run the app using npm start command. 

  ```sh
  $ git clone https://github.com/PioterAndrzejewski/team_manager_backend.git
  $ cd team_manager_backend
  $ npm i
  $ npm start
  ```
Now you're ready to test the app in your browser on localhost:3000

### Built With

- node,
- express,

## About The Project

This is a web app created to help manage your teams and projects you are working with. 

### Project Aim

The goal was to use in practice programming skills learned from courses and in the same time create application that may be used in practice. This two objectives were leading the way during the whole project development and indicating the features that may be useful and should be created.

### Front-end

Team Manager is full stack app. 
See Front-end repo <a href="https://github.com/PioterAndrzejewski/team_manager_frontend">Here</a>

    
 ## Structure of database
 
![image](https://user-images.githubusercontent.com/109315248/216416614-aa463a3d-b399-44ab-9923-27c96894ddc1.png)

 ## Features
 
The backend responds to requests from the front-end application allowing the following:

 ### create project
 ![image](https://user-images.githubusercontent.com/109315248/216418866-71a76c2d-a8de-4936-b6af-f07512ffb68d.png)

After receiving a request to create a new project, the application:
- reaches for data with a list of current projects,
- creates a unique ID for a new project,
- based on the data provided by the user (project name, first member) and the created ID, it prepares a folder with files and a database structure for the newly opened project.

After a successful operation, it returns success information with the ID of the new project.
 
  ### open a project
 
 ![image](https://user-images.githubusercontent.com/109315248/216419357-2c10073e-c40f-4a88-8c68-b4380434ddbd.png)
 
After receiving a request for data from an existing project, the application:
- checks the existence of the project in the database,
- after a successful check, it sends a set of necessary information about the project for processing on the front-end side
 
  ### Manage a team
 
![image](https://user-images.githubusercontent.com/109315248/216422900-dd04a997-99af-4e07-9eaa-6b84972164fe.png)

Upon receiving a request from the application, the front-end processes the following requests:
- editing an existing member,
- deleting an existing member,
- adding new members

  ### Manage tasks
  
![image](https://user-images.githubusercontent.com/109315248/216420274-9d88ae9d-9e9e-4d5c-bafb-e03ee523ee60.png)

Upon receiving a request from the application, the front-end processes the following requests:
- editing existing tasks,
- deleting existing tasks,
- changing the status of existing tasks,
- adding and removing assignees,
- receiving and saving files with photos of team members

### manage project

![image](https://user-images.githubusercontent.com/109315248/216420523-a35d7ff9-21e0-43ab-85bd-5df33e86a9d4.png)

Upon receiving a request from the application, the front-end processes the following requests:
- changing the name of the team,
- deleting the project

### sending images

![image](https://user-images.githubusercontent.com/109315248/216422570-410dffa5-52f8-47f9-a351-cd7097bd575c.png)

The front-end application queries photos indexed based on team member IDs in various places, and the back-end application submits these images.

 ## Project status
 
 The main core of the application is finished. Is has all the functions that were established at the beginning of the project. The architecture of the application allows to add more features without major interference with the current ones.

Next phase is to check the project in use and according to received feedback establish next development steps.

## Room for improvement

The main development opportunities are:

- integration with google or Microsoft services (calendar, to-do List etc.),
- creating new user type - with access to data without possibility to change it, or change it with limited scope,
- connecting the project to the database (mongoDB/ MySQL),
- implementation of authentication,


![logo](https://user-images.githubusercontent.com/109315248/216438997-36ea03a5-6de8-467e-af10-c6a0ffe0f402.png)
