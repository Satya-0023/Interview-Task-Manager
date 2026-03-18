const asyncHandler = require('express-async-handler');
const taskService = require('../services/taskService');

// Get all tasks for the logged-in user
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasksForUser(req.user.id);
  
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim().length < 3) {
    res.status(400);
    throw new Error('Please add a descriptive title (at least 3 characters)');
  }

  const task = await taskService.createTask({
    title,
    description: description || '',
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: task,
  });
});

// Update task status or details
const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Security Verification (Business Logic)
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to update this task');
  }

  const updatedTask = await taskService.updateTask(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: updatedTask,
  });
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Security Verification (Business Logic)
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to delete this task');
  }

  await taskService.deleteTask(req.params.id);

  res.status(200).json({
    success: true,
    data: { id: req.params.id },
  });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
