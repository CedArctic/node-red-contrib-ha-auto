const utils = require("../utils/utils.js");
module.exports = function(RED) {
    function GenerateNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        // State object. Used to merge all incoming messages (Broker and Attributes) for this Entity
        let state = {automations: {}, entities: {}, brokers: {}};

        //console.log("Initial State", state);
        // Register input event action to process message
        this.on('input', function(msg, send, done){

            // Deep merge message and state
            state = utils.mergeDeep(state, msg);

            // Final model
            let model = "";

            // Parse brokers
            for (const [key, broker] of Object.entries(state["brokers"])) {
                // Base of broker
                model = model +
                    `${broker.b_type}:\n` +
                    `\tname: ${broker.name}\n` +
                    `\thost: ${broker.host}\n` +
                    `\tport: ${broker.port}\n` +
                    `\tcredentials:\n` +
                    `\t\tusername: ${broker.username}\n` +
                    `\t\tpassword: ${broker.password}\n`;

                // AMQP additions
                if (broker.b_type === "amqp" && broker.exchange != "") {
                    model = model + `\texchange: ${broker.exchange}\n`;
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
                    `\ttopic: ${entity.topic}\n` +
                    `\tbroker: ${entity.broker}\n` +
                    `\tattributes:\n`;

                // Parse attributes
                for (const [key, attribute] of Object.entries(entity.attributes)) {
                    model = model + `\t\t- ${attribute["name"]}: ${attribute["a_type"]}\n`;
                }

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
                    `\tactions:\n`;

                // Parse actions
                for (const [attribute, value] of Object.entries(automation.actions)) {
                    model = model + `\t\t- ${attribute}: ${value}\n`;
                }

                // Newline
                model = model + `\n`;
            }

            // Put model in message payload so it can be sent using the MQTT node
            msg.payload = model;

            // Send message
            send(msg);

            // Signal to Node-RED that message processing is done
            if (done) {
                done();
            }
        });
    }
    RED.nodes.registerType("generate", GenerateNode);
}