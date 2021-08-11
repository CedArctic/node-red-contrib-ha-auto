const utils = require("../utils/utils.js");
const mqtt = require('mqtt');

module.exports = function(RED) {
    function LaunchNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        /*
        Artificial delay on Node-RED flow Deployment. This delay is in place so that the Generate node can receive
        all required messages and send out a single final configuration rather than send partially formed HA-Auto
        configurations each time that it receives an input message.
        */
        let initTimeout = 2000;

        // State object. Used to merge all incoming messages (Broker and Attributes) for this Entity
        let state = {automations: {}, entities: {}, brokers: {}};

        // Register input event action to process message
        this.on('input', function(msg, send, done){

            // Deep merge message and state
            state = utils.mergeDeep(state, msg);

            // Signal to Node-RED that message processing is done
            if (done) {
                done();
            }
        });

        // Generate and send final message after initial delay to wait and receive all incoming messages
        setTimeout(function(){
            // Final model
            let model = "";

            // Parse brokers
            for (const [key, broker] of Object.entries(state["brokers"])) {
                // Base of broker
                model = model +
                    `${broker.b_type}:\n` +
                    `\tname: ${broker.name}\n` +
                    `\thost: \"${broker.host}\"\n` +
                    `\tport: ${broker.port}\n` +
                    `\tcredentials:\n` +
                    `\t\tusername: \"${broker.username}\"\n` +
                    `\t\tpassword: \"${broker.password}\"\n`;

                // AMQP additions
                if (broker.b_type === "amqp" && broker.exchange != "") {
                    model = model + `\texchange: \"${broker.exchange}\"\n`;
                    model = model + `\tvhost: \"${broker.vhost}\"\n`;
                }

                // Redis additions
                if (broker.b_type === "redis" && broker.db != "") {
                    model = model + `\tdb: ${broker.db}\n`;
                }

                // Newline
                model = model + `\n`;
            }

            // Newlines
            model = model + `\n\n`;

            // Parse entities
            for (const [key, entity] of Object.entries(state["entities"])) {
                // Base of entity
                model = model +
                    `entity:\n` +
                    `\tname: ${entity.name}\n` +
                    `\ttopic: \"${entity.topic}\"\n` +
                    `\tbroker: ${entity.broker}\n` +
                    `\tattributes:\n`;

                // Parse attributes
                entity.attributes.split("\n").forEach((line) => model = model + `\t\t- ${line}\n`)

                // Newline
                model = model + `\n`;
            }

            // Newlines
            model = model + `\n\n`;

            // Parse automations
            for (const [key, automation] of Object.entries(state["automations"])) {
                // Base of automation
                model = model +
                    `automation:\n` +
                    `\tname: ${automation.name}\n` +
                    `\tcondition: ${automation.condition}\n` +
                    `\tenabled: ${automation.enabled}\n` +
                    `\tcontinuous: ${automation.continuous}\n` +
                    `\tactions:\n`;

                // Parse actions
                for (const [attribute, value] of Object.entries(automation.actions)) {
                    model = model + `\t\t- ${attribute}: ${value}\n`;
                }

                // Newline
                model = model + `\n`;
            }

            // Put model in message payload
            state.payload = {"config": model};

            // Send message on node output
            node.send(state);

            // Connect to MQTT and send message if optional MQTT is configured
            if ((config.host !== "") && (config.port !== "")){
                let mqtt_options = {
                  port: config.port,
                  clientId: 'ha_nr_mqtt',
                  username: config.username,
                  password: config.password
                };
                let client = mqtt.connect('mqtt://' + config.host, mqtt_options);

                client.on('connect', function () {
                  client.subscribe(config.topic, function (err) {
                    if (!err) {
                        console.log("Connected to HA-Auto MQTT config broker")
                    }
                  })
                  // Send configuration
                  client.publish(config.topic, JSON.stringify(state.payload));
                  // Close connection
                  client.end();
                })
            }

        }, initTimeout);
    }
    RED.nodes.registerType("launch", LaunchNode);
}