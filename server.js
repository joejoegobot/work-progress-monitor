const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001; // Using port 3001 to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// File paths
const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
function initializeDataFiles() {
    if (!fs.existsSync(PROJECTS_FILE)) {
        fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(TASKS_FILE)) {
        fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
    }
}

initializeDataFiles();

// Helper functions to read/write data
function readProjects() {
    try {
        const content = fs.readFileSync(PROJECTS_FILE, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        console.error('Error reading projects:', err);
        return [];
    }
}

function writeProjects(projects) {
    try {
        fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    } catch (err) {
        console.error('Error writing projects:', err);
    }
}

function readTasks() {
    try {
        const content = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        console.error('Error reading tasks:', err);
        return [];
    }
}

function writeTasks(tasks) {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error('Error writing tasks:', err);
    }
}

// API Routes

// Projects
app.get('/api/projects', (req, res) => {
    const projects = readProjects();
    res.json(projects);
});

app.post('/api/projects', (req, res) => {
    const projects = readProjects();
    const newProject = {
        id: Date.now().toString(),
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate || new Date().toISOString(),
        endDate: req.body.endDate,
        status: req.body.status || 'active', // active, completed, paused
        progress: req.body.progress || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    writeProjects(projects);
    res.json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
    const projects = readProjects();
    const projectId = req.params.id;
    
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }
    
    projects[projectIndex] = {
        ...projects[projectIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    
    writeProjects(projects);
    res.json(projects[projectIndex]);
});

app.delete('/api/projects/:id', (req, res) => {
    const projects = readProjects();
    const projectId = req.params.id;
    
    const filteredProjects = projects.filter(p => p.id !== projectId);
    writeProjects(filteredProjects);
    
    // Also remove associated tasks
    const tasks = readTasks().filter(t => t.projectId !== projectId);
    writeTasks(tasks);
    
    res.json({ success: true });
});

// Tasks
app.get('/api/tasks', (req, res) => {
    const tasks = readTasks();
    const projectId = req.query.projectId;
    
    if (projectId) {
        res.json(tasks.filter(task => task.projectId === projectId));
    } else {
        res.json(tasks);
    }
});

app.post('/api/tasks', (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: Date.now().toString(),
        projectId: req.body.projectId,
        title: req.body.title,
        description: req.body.description,
        assignee: req.body.assignee || 'Unassigned',
        priority: req.body.priority || 'medium', // low, medium, high
        status: req.body.status || 'todo', // todo, in-progress, review, done
        progress: req.body.progress || 0,
        estimatedHours: req.body.estimatedHours || 0,
        actualHours: req.body.actualHours || 0,
        startDate: req.body.startDate || new Date().toISOString(),
        dueDate: req.body.dueDate,
        comments: req.body.comments || [], // Initialize comments array
        suggestedBy: req.body.suggestedBy, // Track if this is a suggested task
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    writeTasks(tasks);
    res.json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskId = req.params.id;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskId = req.params.id;
    
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    writeTasks(filteredTasks);
    
    res.json({ success: true });
});

// Dashboard stats
app.get('/api/stats', (req, res) => {
    const projects = readProjects();
    const tasks = readTasks();
    
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    
    const overallProgress = totalProjects > 0 
        ? projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects 
        : 0;
    
    res.json({
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        overallProgress: Math.round(overallProgress * 100) / 100
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Work Progress Monitor is running on port ${PORT}`);
    console.log(`Access the app from anywhere:`);
    console.log(`http://YOUR_SERVER_IP_OR_DOMAIN:${PORT}`);
    console.log(`Or locally: http://localhost:${PORT}`);
});