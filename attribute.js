module.exports = function(RED) {
    function AttributeNode(config) {
        // Artificial timeout on deployment so that all nodes can be initialized.
        let initTimeout = 500;
        RED.nodes.createNode(this, config);
        const node = this;
        const msg = {attributes: {}}
        msg["attributes"][this.name] = {
            name: this.name,
            a_type: config.a_type
        }
        // Send message after initial delay
        setTimeout(() => node.send(msg), initTimeout);
    }
    RED.nodes.registerType("attribute", AttributeNode);
}