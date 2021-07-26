module.exports = function(RED) {

    function EntityNode(config) {
        // Artificial timeout on deployment so that all nodes can be initialized.
        let initTimeout = 500;
        RED.nodes.createNode(this, config);
        const node = this;
        // State object. Used to merge all incoming messages (Broker and Attributes) for this Entity
        let state = {entities:{}}
        // Add entity properties into state variable
        state["entities"][this.name] = {
            name: this.name,
            topic: config.topic,
            attributes: {}
        }
        //console.log("Initial State", state);
        // Register input event action to process message
        this.on('input', function(msg, send, done){
            //console.log("State", state);
            //console.log("Message", msg);
            // If the message is a broker message, update the entity to contain its broker
            if ('brokers' in msg){
                //console.log("Message: Broker keys", Object.keys(msg["brokers"]));
                // At this stage we expect a single key as single Brokers are directly connected onto the Entity
                state["entities"][this.name]["broker"] = msg["brokers"][Object.keys(msg["brokers"])[0]]["name"];
            }
            // If the message is an attribute message, update the entity to contain its attribute
            if ('attributes' in msg){
                //console.log("Message: Attributes keys", Object.keys(msg["attributes"]));
                // At this stage we expect a single key as single Attributes are directly connected onto the Entity
                state["entities"][this.name]["attributes"] = Object.assign(state["entities"][this.name]["attributes"], msg["attributes"]);
            }
            // Update the state variable and then assign it to the msg variable
            msg = Object.assign(state, msg);
            // Send the message
            //console.log("Final Message", msg);
            send(msg);
            // Signal to Node-RED that message processing is done
            if (done) {
                done();
            }
        });
    }
    RED.nodes.registerType("entity", EntityNode);
}