const fastify = require('fastify')();
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todos');



async function startServer() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB database');
    await fastify.register(todoRoutes);
    console.log('routes registered')

    await fastify.listen(3000, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log('Server running on http://localhost:3000');
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();




