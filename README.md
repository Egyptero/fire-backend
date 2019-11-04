# firemisc backend

Firemisc Backend Application. This application is created using Node.js
Visit our site at the [link](https://www.firemisc.com)
Demo deployment at the [link](http://cloud.firemisc.com)

## Overview

Firemisc is cloud contact center solution. The application is designed based on Node.js as backend solution and React as frontend solution.

Backend system consists of many components:

## Models

The model is representing the data model used by the backend system. Model is designed to work on mongo database. Many data models are implemented within this component.

### Tenant Model

## Routers

## Middleware

## Run the backend application

In order to run the backend application , you will need to clone the application from this [link](https://github.com/Egyptero/fire-backend)
After that , you should run command line on windows or shell on linux. Navigate to the installation folder ../fire-backend

Next step => Run **npm i** in order to install project dependency.
Next step => Install Mongo DB.
Next step => Configure the application file ../config/development.json to the correct parameters. Default values already defined.
Next step => Run **npm start** in order to start the application.

In order to run the contact center , you will need to download the frontend too from this [link](https://github.com/Egyptero/fire-frontend)

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:5555](http://localhost:5555) to view it in the browser.
You can check the API documents at the folder ./docs/FIRE-APIS.xlsx to test the APIs.
