const express = require('express');
const app = express();
var cors = require('cors')
const PORT = process.env.PORT || 5000;
const { joinMarketplace } = require('./src/services/market');
app.use(express.json());
app.use(cors());


// Routes
const assetRouter = require('./src/controllers/AssetController');
const governanceRouter = require('./src/controllers/GovernanceController');

// New route for join marketplace
app.post('/api/join-marketplace', (req, res) => {
  const { userAddress } = req.body;

  // Validate userAddress
  if (!userAddress) {
    return res.status(400).json({ message: 'User address is required' });
  }

  console.log(userAddress);

  // Add logic to store the user's address in the marketplace or perform other actions
 

  // Send a response back to the frontend
  res.json({ message: 'User joined the marketplace successfully' });
});

// Existing routes
app.use('/api/assets', assetRouter);
app.use('/api/governance', governanceRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
