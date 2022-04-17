[![build](https://github.com/Kalafut-organization/elephant_vending_machine_frontend/workflows/build/badge.svg)](https://github.com/Kalafut-organization/elephant_vending_machine_frontend/actions?query=workflow%3Abuild)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Kalafut-organization/elephant_vending_machine_frontend/blob/master/LICENSE.md)
[![codecov](https://codecov.io/gh/Kalafut-organization/elephant_vending_machine_frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/Kalafut-organization/elephant_vending_machine_frontend)
[![docs](https://github.com/Kalafut-organization/elephant_vending_machine_frontend/workflows/docs/badge.svg)](https://kalafut-organization.github.io/elephant_vending_machine_frontend/)

# Elephant Vending Machine
OSU CSE 5911 Capstone Project: Elephant Vending Machine in coordination with Cincinnati Zoo. Designed to facilitate automated behavioral psychology experiments.

## Dependencies
For this project to run successfully, you must have installed:
* Node >= 8.10
* npm >= 5.6

## Viewing Documentation
1. Navigate to the root directory of this project
1. Run `npm run docs`
1. Open the generated page in `docs/index.html` in a browser
    * Up to date documentation can be found [here](https://Kalafut-organization.github.io/elephant_vending_machine_frontend).

## Running linting
1. Navigate to the root directory of this project
1. Run `npm run lint`
    * Note: Code is automatically formatted with Prettier on each commit. You can use `npm run format` to run the formatter manually

## Running tests
1. Navigate to the root directory of this project
1. Run `npm test`
    * A coverage report can be viewed with `npm run test:coverage`

## Running in production
1. Clone this repo to the Pi
1. Navigate to the cloned directory
1. [Install docker and docker-compose](https://dev.to/rohansawant/installing-docker-and-docker-compose-on-the-raspberry-pi-in-5-simple-steps-3mgl)
1. Ensure that the `.env` file has the address that the backend is using. For the backend running in docker, this should be `http://192.168.0.100`.
1. Run `docker-compose up --build` to build and start the container
    * This will ensure the app automatically restarts in case of errors or reboots.
    * To stop the containers you can use `ctrl-c` or `docker-compose down`
    * For the build to be successful, you will most likely need to temporarily disable to static IP of the pi.
    
## Running in Dev
You will need to run commands on the server Pi though ssh network commands, this is included in these instructions.

1. Connect to the same network as the Server Pi and navigate to your terminal
1. run command, `ssh pi@192.168.0.100`
1. A sign in should appear, username is `pi` password is `raspberry`
1. You should now be in the Server Pi terminal
1. Enter the directory for the backend by running command `cd elephant_vending_machine_frontend`
1. Ensure that the `.env` file has the address that the backend is using. For the backend running in development with Flask, this should be `http://192.168.0.100:5000`.
1. Run this command `npm start`
   * You may first need to run `export NODE_OPTIONS=--openssl-legacy-provider`
1. The front end should open on your web browser

## Running Automatically
You will need to run commands on the server Pi though ssh network commands, this is included in these instructions.

1. Connect to the same network as the Server Pi and navigate to your terminal
1. run command, `ssh pi@192.168.0.100`
1. A sign in should appear, username is `pi` password is `raspberry`
1. You should now be in the Server Pi terminal
1. Enter the directory for the backend by running command `cd elephant_vending_machine_frontend`
6. Execute the setup shell script "setup.sh" by running the command "bash setup.sh" in terminal
7. Assuming connections are good, this script will launch front-end and back-end.
8. To exit, use the CTRL-C hotkey to exit the front-end, and run the shell script "clearExperiment.sh" by running the command "bash clearExperiment.sh" in terminal
