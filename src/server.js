require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connected");
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error(`Database connection failed: ${err.message}`);
  });
