const server = require("./src/app");

const port = process.env.PORT || 8989;

server.listen(port, function() {
    console.log(`Listening to port ${port}\n`);
});
