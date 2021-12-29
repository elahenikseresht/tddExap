const { app } = require('./app');
const mongoose = require('mongoose');
const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/product', {});
    console.log('database connected!');
  } catch (error) {
    console.log(error);
  }
};

app.listen(5000, () => {
  console.log('server is listening on port 5000');
  connect();
});
