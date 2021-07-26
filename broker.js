module.exports = function(RED) {
    function BrokerNode(config) {
        // Artificial timeout on deployment so that all nodes can be initialized.
        let initTimeout = 500;
        RED.nodes.createNode(this, config);
        const node = this;
        // Add broker properties into message
        const msg = {brokers: {}}
        msg["brokers"][this.name] = {
            name: this.name,
            host: config.host,
            port: config.port,
            b_type: config.b_type,
            username: config.username,
            password: config.password,
            db: config.db,
            exchange: config.exchange
        }
        // Send message after initial delay
        setTimeout(() => node.send(msg), initTimeout);
    }
    RED.nodes.registerType("broker", BrokerNode);
}