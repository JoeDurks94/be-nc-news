const app = require("./app.js");
const { PORT = 9898 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
