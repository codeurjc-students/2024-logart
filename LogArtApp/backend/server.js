const app = require('./app');
const { port } = require('./config/environment');

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});