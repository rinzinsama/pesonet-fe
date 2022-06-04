const express = require("express"),
    serveStatic = require("serve-static"),
    history = require("connect-history-api-fallback"),
    port = process.env.PORT || 82;

const app = express();

app.use(history());
app.use(serveStatic(__dirname + "/public"));
app.listen(port, console.log(`server running at port number: ${port}`));
