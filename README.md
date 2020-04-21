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

## Starting the user interface
NOTE: You will need to set your local environment variables if not connected to the actual backend running on the
Raspberry Pi attached to the real hardware. See [documentation here](https://create-react-app.dev/docs/adding-custom-environment-variables/)
for reference.

1. Navigate to the root directory of this project
1. Run `npm start`

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
1. Run `docker-compose up --build` to start the container
    * This will ensure the app automatically restarts in case of errors or reboots.
    * To stop the containers you can use `ctrl-c` or `docker-compose down`