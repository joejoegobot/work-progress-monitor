// API base URL
const API_BASE = '/api';

// DOM Elements
const projectForm = document.getElementById('project-form');
const projectsList = document.getElementById('projects-list');
const tasksList = document.getElementById('tasks-list');

// Stats elements
const totalProjectsEl = document.getElementById('total-projects');
const activeProjectsEl = document.getElementById('active-projects');
const completedProjectsEl = document.getElementById('completed-projects');
const overallProgressEl = document.getElementById('overall-progress');

// Initialize the app
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Load initial data
    await loadStats();
    await loadProjects();
    
    // Add event listeners
    projectForm.addEventListener('submit', handleProjectSubmit);
}

// Handle project form submission
async function handleProjectSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('project-name').value,
        description: document.getElementById('project-description').value,
        startDate: document.getElementById('project-start-date').value,
        endDate: document.getElementById('project-end-date').value,
        status: document.getElementById('project-status').value
    };
    
    try {
        await createProject(formData);
        
        // Reset form
        projectForm.reset();
        
        // Reload data
        await loadStats();
        await loadProjects();
    } catch (error) {
        console.error('Error creating project:', error);
        alert('Error creating project. Please try again.');
    }
}

// API Functions
async function createProject(projectData) {
    const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to create project');
    }
    
    return response.json();
}

async function getProjects() {
    const response = await fetch(`${API_BASE}/projects`);
    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }
    return response.json();
}

async function getTasks(projectId) {
    const url = projectId ? `${API_BASE}/tasks?projectId=${projectId}` : `${API_BASE}/tasks`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return response.json();
}

async function updateProject(id, projectData) {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to update project');
    }
    
    return response.json();
}

async function deleteProject(id) {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete project');
    }
    
    return response.json();
}

async function createTask(taskData) {
    const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to create task');
    }
    
    return response.json();
}

async function updateTask(id, taskData) {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to update task');
    }
    
    return response.json();
}

async function getStats() {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch stats');
    }
    return response.json();
}

// Data Loading Functions
async function loadStats() {
    try {
        const stats = await getStats();
        
        totalProjectsEl.textContent = stats.totalProjects;
        activeProjectsEl.textContent = stats.activeProjects;
        completedProjectsEl.textContent = stats.completedProjects;
        overallProgressEl.textContent = `${Math.round(stats.overallProgress)}%`;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadProjects() {
    try {
        const projects = await getProjects();
        renderProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderProjects(projects) {
    projectsList.innerHTML = '';
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No projects yet. Add your first project using the form above.</p>';
        return;
    }
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsList.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.className = `project-card ${project.status}`;
    
    const progressPercentage = Math.round(project.progress || 0);
    
    projectCard.innerHTML = `
        <div class="project-header">
            <div class="project-title">${project.name}</div>
            <div class="project-actions">
                <button class="btn-warning" onclick="handleEditProject('${project.id}')">Edit</button>
                <button class="btn-danger" onclick="handleDeleteProject('${project.id}')">Delete</button>
            </div>
        </div>
        <div class="project-description">${project.description || 'No description provided.'}</div>
        <div class="progress-bar">
            <div class="progress-bar-inner" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="progress-text">${progressPercentage}% Complete</div>
        <div class="project-meta">
            <span>Started: ${formatDate(project.startDate)}</span>
            <span>Status: ${project.status}</span>
        </div>
    `;
    
    // Add task form for this project
    const taskForm = createTaskForm(project.id);
    projectCard.appendChild(taskForm);
    
    // Load and display tasks for this project
    loadProjectTasks(project.id, projectCard);
    
    return projectCard;
}

function createTaskForm(projectId) {
    const taskForm = document.createElement('div');
    taskForm.className = 'task-form';
    taskForm.innerHTML = `
        <h3>Add New Task</h3>
        <div class="form-group">
            <label for="task-title-${projectId}">Task Title</label>
            <input type="text" id="task-title-${projectId}" placeholder="Enter task title">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="task-priority-${projectId}">Priority</label>
                <select id="task-priority-${projectId}">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div class="form-group">
                <label for="task-assignee-${projectId}">Assignee</label>
                <input type="text" id="task-assignee-${projectId}" placeholder="Assign to">
            </div>
        </div>
        <button onclick="handleAddTask('${projectId}')">Add Task</button>
    `;
    
    return taskForm;
}

async function loadProjectTasks(projectId, projectCard) {
    try {
        const tasks = await getTasks(projectId);
        const tasksContainer = document.createElement('div');
        tasksContainer.className = 'project-tasks';
        tasksContainer.id = `tasks-${projectId}`;
        
        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskElement = createTaskElement(task);
                tasksContainer.appendChild(taskElement);
            });
        } else {
            tasksContainer.innerHTML = '<p style="color: #666; font-style: italic; padding: 10px 0;">No tasks yet for this project.</p>';
        }
        
        projectCard.appendChild(tasksContainer);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function createTaskElement(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${task.status} ${task.priority}-priority`;
    
    // Calculate progress percentage based on subtasks if available
    let progressPercentage = task.progress || 0;
    if (task.subtasks && task.subtasks.length > 0) {
        const completedSubtasks = task.subtasks.filter(st => st.status === 'done').length;
        progressPercentage = Math.round((completedSubtasks / task.subtasks.length) * 100);
    }
    
    taskCard.innerHTML = `
        <div class="task-info">
            <div class="task-title">${task.title} <span class="task-progress">(${progressPercentage}%)</span></div>
            <div class="task-meta">
                Assignee: ${task.assignee || 'Unassigned'} | 
                Priority: ${task.priority} | 
                Due: ${task.dueDate ? formatDate(task.dueDate) : 'No due date'}
            </div>
            <div class="task-comments">
                <h4>Comments:</h4>
                <div class="comments-list" id="comments-${task.id}">
                    ${(task.comments && task.comments.length > 0) 
                        ? task.comments.map(comment => 
                            '<div class="comment"><p>' + comment.text + '</p><small>Posted: ' + formatDate(comment.date || comment.createdAt) + '</small></div>'
                          ).join('')
                        : '<p class="no-comments">No comments yet. Add your thoughts below.</p>'
                    }
                </div>
                <div class="add-comment">
                    <textarea id="comment-input-${task.id}" placeholder="Add a comment..."></textarea>
                    <button onclick="handleAddComment('${task.id}')">Add Comment</button>
                </div>
            </div>
            ${task.suggestedBy ? 
                '<div class="suggestion-notice">Suggested by: ' + task.suggestedBy + 
                ' <button class="btn-success" onclick="approveSuggestedTask(\'' + task.id + '\')">Approve</button>' +
                ' <button class="btn-danger" onclick="denySuggestedTask(\'' + task.id + '\')">Deny</button></div>' 
                : ''}
        </div>
        <div class="task-actions">
            <button class="btn-warning" onclick="handleToggleTaskStatus('${task.id}', '${task.status === 'done' ? 'todo' : 'done'}')">Mark ${task.status === 'done' ? 'Undone' : 'Done'}</button>
            <button class="btn-danger" onclick="handleDeleteTask('${task.id}')">Delete</button>
        </div>
    `;
    
    return taskCard;
}

// Event Handlers
async function handleEditProject(projectId) {
    // For simplicity, we'll just alert that editing is available
    // In a real app, this would open a modal or form
    alert(`Edit functionality for project ${projectId} would open here`);
}

async function handleDeleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) {
        try {
            await deleteProject(projectId);
            await loadStats();
            await loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error deleting project. Please try again.');
        }
    }
}

async function handleAddTask(projectId) {
    const titleInput = document.getElementById(`task-title-${projectId}`);
    const prioritySelect = document.getElementById(`task-priority-${projectId}`);
    const assigneeInput = document.getElementById(`task-assignee-${projectId}`);
    
    const title = titleInput.value.trim();
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const taskData = {
        projectId,
        title,
        priority: prioritySelect.value,
        assignee: assigneeInput.value.trim(),
        status: 'todo'
    };
    
    try {
        await createTask(taskData);
        
        // Clear inputs
        titleInput.value = '';
        assigneeInput.value = '';
        
        // Reload projects to show updated tasks
        await loadProjects();
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Error creating task. Please try again.');
    }
}

async function handleToggleTaskStatus(taskId, newStatus) {
    try {
        await updateTask(taskId, { status: newStatus });
        await loadProjects(); // Reload to show updated task status
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Error updating task. Please try again.');
    }
}

async function handleDeleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await fetch(`${API_BASE}/tasks/${taskId}`, {
                method: 'DELETE'
            });
            await loadProjects(); // Reload to show updated tasks
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Error deleting task. Please try again.');
        }
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Function to add a comment to a task
async function handleAddComment(taskId) {
    const commentInput = document.getElementById(`comment-input-${taskId}`);
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        alert('Please enter a comment');
        return;
    }
    
    try {
        // Get the current task
        const tasks = await getTasks();
        const task = tasks.find(t => t.id === taskId);
        
        if (!task.comments) {
            task.comments = [];
        }
        
        // Add the new comment
        task.comments.push({
            text: commentText,
            date: new Date().toISOString(),
            author: 'User' // Could be customized based on authentication
        });
        
        // Update the task
        await updateTask(taskId, task);
        
        // Clear the input
        commentInput.value = '';
        
        // Reload the projects to show the updated comment
        await loadProjects();
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Error adding comment. Please try again.');
    }
}

// Function to approve a suggested task
async function approveSuggestedTask(taskId) {
    try {
        // Update the task to remove the suggestedBy property and mark as approved
        const tasks = await getTasks();
        const task = tasks.find(t => t.id === taskId);
        
        // Remove the suggestedBy property to indicate it's now approved
        delete task.suggestedBy;
        task.status = 'todo'; // Set to default status after approval
        
        await updateTask(taskId, task);
        
        // Reload projects to reflect the change
        await loadProjects();
        
        alert('Task approved successfully!');
    } catch (error) {
        console.error('Error approving task:', error);
        alert('Error approving task. Please try again.');
    }
}

// Function to deny and delete a suggested task
async function denySuggestedTask(taskId) {
    if (confirm('Are you sure you want to deny and remove this suggested task?')) {
        try {
            await handleDeleteTask(taskId);
            alert('Task denied and removed.');
        } catch (error) {
            console.error('Error denying task:', error);
            alert('Error denying task. Please try again.');
        }
    }
}

// Function to suggest a task (to be called by AI assistant)
function suggestTask(projectId, title, description = '', priority = 'medium', assignee = '') {
    // This function would be called by the AI assistant to suggest a task
    // The user will then have the option to approve or deny it
    
    const suggestedTask = {
        projectId,
        title,
        description,
        priority,
        assignee,
        status: 'todo',
        suggestedBy: 'AI Assistant', // Mark as suggested by AI
        createdAt: new Date().toISOString()
    };
    
    // In a real implementation, this would make an API call
    // For now, we'll simulate the suggestion
    console.log('Task suggested:', suggestedTask);
    alert(`Task suggestion: "${title}" has been suggested for your review.`);
}

// Make functions available globally for inline event handlers
window.handleEditProject = handleEditProject;
window.handleDeleteProject = handleDeleteProject;
window.handleAddTask = handleAddTask;
window.handleToggleTaskStatus = handleToggleTaskStatus;
window.handleDeleteTask = handleDeleteTask;
window.handleAddComment = handleAddComment;
window.approveSuggestedTask = approveSuggestedTask;
window.denySuggestedTask = denySuggestedTask;
window.suggestTask = suggestTask;

// Add PWA installation prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Update UI to notify the user they can install the PWA
    showInstallButton();
});

function showInstallButton() {
    // Create an install button if one doesn't already exist
    if (!document.querySelector('.pwa-install-btn')) {
        const installBtn = document.createElement('button');
        installBtn.textContent = 'Install App';
        installBtn.classList.add('pwa-install-btn');
        installBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2575fc;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
            display: none;
        `;
        
        installBtn.addEventListener('click', async () => {
            // Hide the install button
            installBtn.style.display = 'none';
            // Show the install prompt
            if (deferredPrompt) {
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                // We've used the prompt, and can't use it again, throw it away
                deferredPrompt = null;
            }
        });
        
        document.body.appendChild(installBtn);
    }
    
    // Show the install button on mobile devices
    if (window.innerWidth < 768) {
        document.querySelector('.pwa-install-btn').style.display = 'block';
    }
}