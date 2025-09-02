const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Jira configuration - теперь настройки приходят из клиента
const JIRA_CONFIG = {
  baseURL: null, // Будет установлено из настроек клиента
  username: null,
  password: null,
  apiToken: null
};

// Helper function to make authenticated requests to Jira
async function makeJiraRequest(endpoint, method = 'GET', data = null, config = null) {
  try {
    if (!config || !config.baseURL || !config.apiToken) {
      throw new Error('Jira configuration is missing. Please configure Jira settings first.');
    }

    const auth = { Authorization: `Bearer ${config.apiToken}` };

    const response = await axios({
      method,
      url: `${config.baseURL}/rest/api/2/${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...auth
      },
      data
    });
    
    return response.data;
  } catch (error) {
    console.error('Jira API error:', error.response?.data || error.message);
    throw error;
  }
}

// API Routes

// Get tasks using JQL query
app.post('/api/tasks', async (req, res) => {
  try {
    const { jql, maxResults, jiraConfig } = req.body;
    
    if (!jql) {
      return res.status(400).json({ error: 'JQL query is required' });
    }

    if (!jiraConfig || !jiraConfig.baseURL || !jiraConfig.apiToken) {
      return res.status(400).json({ error: 'Jira configuration is required. Please configure Jira settings first.' });
    }

    // Валидация лимита
    const limit = maxResults || 50;
    if (limit < 1 || limit > 1000) {
      return res.status(400).json({ error: 'maxResults must be between 1 and 1000' });
    }

    const searchData = {
      jql: jql,
      maxResults: limit,
      fields: ['summary', 'description', 'components', 'timeestimate', 'timeoriginalestimate', 'key', 'issuetype', 'priority', 'assignee', 'reporter']
    };

    const tasks = await makeJiraRequest('search', 'POST', searchData, jiraConfig);
    
    const formattedTasks = tasks.issues.map(issue => ({
      id: issue.key,
      summary: issue.fields.summary,
      description: issue.fields.description || 'No description',
      components: issue.fields.components?.map(c => c.name) || [],
      timeEstimate: issue.fields.timeestimate || issue.fields.timeoriginalestimate || 0,
      issueType: issue.fields.issuetype?.name || 'Unknown',
      priority: issue.fields.priority?.name || 'Medium',
      assignee: issue.fields.assignee?.displayName || 'Не назначен',
      reporter: issue.fields.reporter?.displayName || 'Не указан',
      link: `${jiraConfig.baseURL}/browse/${issue.key}`
    }));

    res.json({ tasks: formattedTasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks from Jira' });
  }
});

// Add label to task
app.post('/api/tasks/:taskId/label', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { label, jiraConfig } = req.body;
    
    if (!label || !['run', 'change'].includes(label)) {
      return res.status(400).json({ error: 'Label must be either "run" or "change"' });
    }

    if (!jiraConfig || !jiraConfig.baseURL || !jiraConfig.apiToken) {
      return res.status(400).json({ error: 'Jira configuration is required. Please configure Jira settings first.' });
    }

    // Get current labels
    const issue = await makeJiraRequest(`issue/${taskId}`, 'GET', null, jiraConfig);
    const currentLabels = issue.fields.labels || [];
    
    // Add new label if not already present
    if (!currentLabels.includes(label)) {
      const updatedLabels = [...currentLabels, label];
      
      await makeJiraRequest(`issue/${taskId}`, 'PUT', {
        fields: {
          labels: updatedLabels
        }
      }, jiraConfig);
    }

    res.json({ success: true, message: `Label "${label}" added to task ${taskId}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add label to task' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get task details
app.post('/api/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { jiraConfig } = req.body;
    
    if (!jiraConfig || !jiraConfig.baseURL || !jiraConfig.apiToken) {
      return res.status(400).json({ error: 'Jira configuration is required. Please configure Jira settings first.' });
    }

    const issue = await makeJiraRequest(`issue/${taskId}`, 'GET', null, jiraConfig);
    
    const task = {
      id: issue.key,
      summary: issue.fields.summary,
      description: issue.fields.description || 'No description',
      components: issue.fields.components?.map(c => c.name) || [],
      timeEstimate: issue.fields.timeestimate || issue.fields.timeoriginalestimate || 0,
      issueType: issue.fields.issuetype?.name || 'Unknown',
      priority: issue.fields.priority?.name || 'Medium',
      assignee: issue.fields.assignee?.displayName || 'Не назначен',
      reporter: issue.fields.reporter?.displayName || 'Не указан',
      labels: issue.fields.labels || [],
      link: `${jiraConfig.baseURL}/browse/${issue.key}`
    };

    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task details' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Jira base URL: ${JIRA_CONFIG.baseURL}`);
});
