const fastifyPlugin = require('fastify-plugin');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Todo = require('../models/todo');


async function routes(fastify, options) {

  // POST Request to Create a New Todo
  fastify.post('/todos', async (request, reply) => {
    try {
      const { title } = request.body;

      if (!title) {
        return reply.code(400).send({ error: 'Title is required' });
      }

      const todo = new Todo({ title });
      await todo.save();

      reply.code(201).send(todo);
    } catch (error) {
      console.error(error)
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

// GET Request to Retrieve a Specific Todo
fastify.get('/todos/:id', async (request, reply) => {
    try {
      const { id } = request.params;
  
      if (!ObjectId.isValid(id)) {
        return reply.code(400).send({ error: 'Invalid ObjectId' });
      }
  
      const todo = await Todo.findById(id);
  
      if (!todo) {
        return reply.code(404).send({ error: 'Todo not found' });
      }
  
      const currentDate = new Date();
      const daysFromCreation = Math.floor(
        (currentDate - todo.dateOfCreation) / (24 * 60 * 60 * 1000)
      );
  
      reply.send({ ...todo.toObject(), daysFromCreation }); // Convert to object
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
  
  //PUT Request to Update a Todo
  fastify.put('/todos/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { title } = request.body;

      if (!title) {
        return reply.code(400).send({ error: 'Title is required' });
      }

      if (!ObjectId.isValid(id)) {
        return reply.code(400).send({ error: 'Invalid ObjectId' });
      }

      const todo = await Todo.findByIdAndUpdate(id, { title }, { new: true });

      if (!todo) {
        return reply.code(404).send({ error: 'Todo not found' });
      }

      reply.send(todo);
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // GET Request to Retrieve All Todos
  fastify.get('/todos', async (request, reply) => {
    try {
      // retrieving all todos from collection
      const todos = await Todo.find();
  
      reply.send(todos);
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

// PUT Request to Mark a Todo as Completed
  fastify.put('/todos/:id/markComplete', async (request, reply) => {
    try {
      const { id } = request.params;

      if (!ObjectId.isValid(id)) {
        return reply.code(400).send({ error: 'Invalid ObjectId' });
      }

      const todo = await Todo.findByIdAndUpdate(
        id,
        { completed: true, dateOfCompletion: Date.now() },
        { new: true }
      );

      if (!todo) {
        return reply.code(404).send({ error: 'Todo not found' });
      }

      reply.send(todo);
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

    //DELETE Request to Delete a Todo
  fastify.delete('/todos/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      if (!ObjectId.isValid(id)) {
        return reply.code(400).send({ error: 'Invalid ObjectId' });
      }

      const todo = await Todo.findByIdAndDelete(id);

      if (!todo) {
        return reply.code(404).send({ error: 'Todo not found' });
      }

      reply.send({ message: 'Todo deleted successfully' });
    } catch (error) {
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

}

module.exports = fastifyPlugin(routes);

