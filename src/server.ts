// server.ts
// Import the Express app
import app from './app';

// Set the port of the server
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

