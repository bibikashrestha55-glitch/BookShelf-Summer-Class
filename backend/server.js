require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = Number(process.env.PORT) || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`BookShelf server running on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
