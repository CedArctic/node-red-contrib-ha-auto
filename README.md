# node-red-contrib-ha-auto
![HA-Auto Logo](logo.png)

[![GitHub license](https://img.shields.io/github/license/CedArctic/node-red-contrib-ha-auto)](https://github.com/CedArctic/node-red-contrib-ha-auto/blob/main/LICENSE)
[![GitHub tag](https://img.shields.io/github/tag/CedArctic/node-red-contrib-ha-auto.svg)](https://GitHub.com/CedArctic/node-red-contrib-ha-auto/tags/)

## Description
This is the HA-Auto Node-RED integration package. It contains nodes for the Node-RED low code environment 
which can be used to set up and deploy Brokers, Entities and Automations. 
Make sure to also check out [HA-Auto](https://github.com/eellak/gsoc2021-HA-Auto-Node-RED) to set up the complete project.

## Installation
- Open up the Terminal or Command Prompt and navigate to your Node-RED installation directory. 
  For local installations see [here](https://nodered.org/docs/getting-started/local)
- Run
  ```npm install path/to/node-red-contrib-ha-auto```

## Getting Started
After installing the package and setting up the [HA-Auto backend](https://github.com/eellak/gsoc2021-HA-Auto-Node-RED), 
you can start creating your Node-RED flows following these simple steps:

1. Drag the Broker node onto the canvas and double click it to configure its settings.
2. Use the Entity node to declare your environment's entities and connect the corresponding Broker node to each Entity 
   input.
3. Create automations using the Automation Node and connecting to the input all relevant Entities that are either in the
Condition or the Actions of the Automation.
4. Connect all Automation nodes to a single Launch node and configure the Launch node with the MQTT server used to 
communicate with HA-Auto.
5. Add a Debug node after the Launch node to see the created Configuration script in the Node-RED debug panel.
6. Hit Deploy!

## Examples 
You can find some pre-made examples in the [examples directory](examples).

## Documentation
The Node-RED nodes in this package contain thorough documentation which can be accessed through the Node-RED 
documentation panel.

Documentation can also be found in the [wiki](https://github.com/eellak/gsoc2021-HA-Auto-Node-RED/wiki).

## Project Structure
- [examples](examples): Contains a number of Node-RED examples on how to use the HA-Auto nodes.
- [src](src): Each node has its own dedicated folder with its front end HTML component and its JS backend component.
- [package.json](src): Contains the package metadata, dependencies and node declarations for Node-RED.

## GSoC
This project was created as part of Google Summer of Code 2021 with GFOSS as the mentor organization.
More information can be found on the 
[GSoC project page](https://summerofcode.withgoogle.com/projects/#5246257838161920).

