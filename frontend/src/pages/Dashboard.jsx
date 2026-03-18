import { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data.data || []);
    } catch (err) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || title.length < 3) return;
    
    setIsSubmitting(true);
    const tempId = Date.now().toString();
    
    try {
      const { data } = await API.post('/tasks', { title, description });
      // Replace temp with actual task from server
      setTasks([data.data, ...tasks]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    
    const previousTasks = [...tasks];
    setTasks(tasks.map((t) => (t._id === id ? { ...t, status: newStatus } : t)));

    try {
      const { data } = await API.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === id ? data.data : t)));
    } catch (err) {
      console.error('Failed to update status, reverting...');
      setTasks(previousTasks); // Rollback on failure
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    
    const previousTasks = [...tasks];
    setTasks(tasks.filter((t) => t._id !== id));

    try {
      await API.delete(`/tasks/${id}`);
    } catch (err) {
      console.error('Failed to delete task, reverting...');
      setTasks(previousTasks); // Rollback on failure
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === 'All' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Task Analytics</h1>
          <p className="text-sm text-gray-500">Track your progress and interview preparation.</p>
        </div>

        {/* Analytics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Tasks', count: totalTasks, color: 'indigo' },
            { label: 'Pending', count: pendingTasks, color: 'yellow' },
            { label: 'Completed', count: completedTasks, color: 'green' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{stat.count}</h2>
              </div>
              <div className={`h-12 w-12 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                <div className={`h-3 w-3 rounded-full bg-${stat.color}-500`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Task Form */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">New Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4 shadow-none">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Task Title (e.g. System Design Prep)"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Add some details..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              disabled={isSubmitting}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {['All', 'Pending', 'Completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
                  filter === f ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or description..."
              className="w-full sm:w-80 rounded-lg border border-gray-200 bg-white px-4 py-2 pl-10 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-lg font-medium text-gray-900">
                  {search ? '🔍 No tasks match your search' : 'No tasks yet'}
                </p>
                <p className="text-gray-500 mt-1">
                  {search ? 'Try a different keyword.' : 'Start preparing for your interviews by creating your first task.'}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task._id} className="group relative rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => toggleStatus(task._id, task.status)}
                      className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.status === 'Completed' ? 'bg-green-500 border-green-500 scale-110' : 'border-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      {task.status === 'Completed' && (
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className={`font-semibold text-lg ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        {/* Status Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      {task.description && (
                        <p className={`text-sm mt-1 leading-relaxed ${task.status === 'Completed' ? 'text-gray-300' : 'text-gray-500'}`}>
                          {task.description}
                        </p>
                      )}
                      <p className="text-[10px] mt-2 font-medium text-gray-400 uppercase tracking-tighter">
                         Added: {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => deleteTask(task._id)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Task"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
