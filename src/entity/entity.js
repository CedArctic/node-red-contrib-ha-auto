module.exports = function(RED) {

    function EntityNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        // State object. Used to merge all incoming messages (Broker and Attributes) for this Entity
        let state = {entities:{}}
        // Add entity properties into state variable
        state["entities"][this.name] = {
            name: this.name,
            topic: config.topic,
            attributes: config.attributes
        }

        // Register input event action to process message
        this.on('input', function(msg, send, done){

            // If the message is a broker message, update the entity to contain its broker
            if ('brokers' in msg){
                // At this stage we expect a single key as single Brokers are directly connected onto the Entity
                state["entities"][this.name]["broker"] = msg["brokers"][Object.keys(msg["brokers"])[0]]["name"];
            }
            // Update the state variable and then assign it to the msg variable
            msg = Object.assign(state, msg);
            // Send the message
            send(msg);
            // Signal to Node-RED that message processing is done
            if (done) {
                done();
            }
        });
    }
    RED.nodes.registerType("entity", EntityNode);
}