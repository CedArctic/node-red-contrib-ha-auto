const utils = require("../utils/utils.js");
module.exports = function(RED) {
    function AutomationNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        // State object. Used to merge all incoming messages (Broker and Attributes) for this Entity
        let state = {automations:{}}

        // Add entity properties into state variable
        state["automations"][this.name] = {
            name: this.name,
            condition: config.condition,
            enabled: config.enabled,
            continuous: config.continuous,
            actions: {}
        }

        // Parse Actions
        const actions_split = config.actions.split(",\n");
        const actions_dict = {};
        actions_split.forEach(function(entry){
            // Split to attribute and value
            let split = entry.split(/:(.+)/);
            attribute = split[0];
            value = split[1];

            // TODO: In the future, value parsing can be implemented, e.g to convert "true" string to true bool type.
            // Not needed for now

            // Add to state["automations"][this.name]["actions"]
            state["automations"][node.name]["actions"][attribute] = value;
        })

        // Register input event action to process message
        this.on('input', function(msg, send, done){
            /*
                TODO: In the future at this point some validation can be implemented. E.g: Check if the Automation's
                Actions involve connected entities and if their types are correct.
            */
            // Update the state variable and then assign it to the msg variable
            state = utils.mergeDeep(state, msg);
            // Send the message
            //console.log("Final Message", msg);
            send(state);
            // Signal to Node-RED that message processing is done
            if (done) {
                done();
            }
        });
    }
    RED.nodes.registerType("automation", AutomationNode);
}