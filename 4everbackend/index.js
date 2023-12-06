const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
const assetRouter = require('./src/controllers/AssetController');
const governanceRouter = require('./src/controllers/GovernanceController');

app.use('/api/assets', assetRouter);
app.use('/api/governance', governanceRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
