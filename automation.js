const utils = require("./utils.js");
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
            actions: {}
        }

        // Parse Actions
        const actions_split = config.actions.split(",\n");
//        console.log(actions_split);
        const actions_dict = {};
        actions_split.forEach(function(entry){
            // Split to attribute and value
            let split = entry.split(/:(.+)/);
            attribute = split[0];
            value = split[1];

            // TODO: Probably do type parsing on value. I.E: convert "true" string to true bool type

            // Add to state["automations"][this.name]["actions"]
            state["automations"][node.name]["actions"][attribute] = value;
        })

        //console.log("Initial State", state);
        // Register input event action to process message
        this.on('input', function(msg, send, done){
            //console.log("State", state);
            //console.log("Message", msg);

            /*
                TODO: In the future at this point some validation can be implemented. E.g: Check if the Automation's
                Actions involve connected entities and if their types are correct.
            */

            // Update the state variable and then assign it to the msg variable
//            console.log("State", state);
//            console.log("Message", msg);
//            state = Object.assign(state, msg);
            state = utils.mergeDeep(state, msg);
//            msg = state;
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