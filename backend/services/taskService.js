const Task = require('../models/Task');

// Business logic for Task operations
class TaskService {
  // Get all tasks for a specific user, newest first
  async getTasksForUser(userId) {
    return await Task.find({ user: userId }).sort({ createdAt: -1 });
  }

  // Create a new task
  async createTask(taskData) {
    return await Task.create(taskData);
  }

  // Find a task by its ID
  async getTaskById(id) {
    return await Task.findById(id);
  }

  // Update task data
  async updateTask(id, updateData) {
    return await Task.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
    });
  }

  // Delete a task by ID
  async deleteTask(id) {
    const task = await Task.findById(id);
    if (!task) return null;
    await task.deleteOne();
    return true;
  }
}

module.exports = new TaskService();
