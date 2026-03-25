// utils/publishUtils.js
import JSZip from 'jszip';

const NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';
const GITHUB_API_BASE = 'https://api.github.com';
const VERCEL_API_BASE = 'https://api.vercel.com';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Configuration from environment variables
const CONFIG = {
  netlify: {
    apiToken: import.meta.env.VITE_NETLIFY_API_TOKEN,
  },
  github: {
    token: import.meta.env.VITE_GITHUB_TOKEN,
    username: import.meta.env.VITE_GITHUB_USERNAME,
  },
  vercel: {
    token: import.meta.env.VITE_VERCEL_TOKEN,
  },
  demoMode: import.meta.env.VITE_DEMO_MODE === 'true'
};

// Debug logging
console.log('Environment check:', {
  apiUrl: API_URL,
  netlifyToken: CONFIG.netlify.apiToken ? 'Present' : 'Missing',
  githubToken: CONFIG.github.token ? 'Present' : 'Missing',
  vercelToken: CONFIG.vercel.token ? 'Present' : 'Missing',
  demoMode: CONFIG.demoMode
});

// Check if service is configured
const isServiceConfigured = (service) => {
  switch (service) {
    case 'netlify':
      return !!CONFIG.netlify.apiToken;
    case 'github-pages':
      return !!(CONFIG.github.token && CONFIG.github.username);
    
    default:
      return false;
  }
};

export class PublishService {
  constructor() {
    this.publishHistory = JSON.parse(localStorage.getItem('publishHistory') || '[]');
  }

  addToHistory(record) {
    this.publishHistory.unshift(record);
    this.publishHistory = this.publishHistory.slice(0, 10); // keep last 10
    localStorage.setItem('publishHistory', JSON.stringify(this.publishHistory));
  }

  getHistory() {
    return this.publishHistory;
  }

  async publishToNetlify(files, projectName) {
    if (!CONFIG.netlify.apiToken) {
      throw new Error('Netlify API token not configured.');
    }

    try {
      if (!files['index.html']) throw new Error('index.html is required.');

      const validFiles = Object.fromEntries(
        Object.entries(files).filter(([_, content]) => content && content.trim())
      );

      const response = await fetch(`${API_URL}/api/publish/netlify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: validFiles,
          projectName,
          apiToken: CONFIG.netlify.apiToken
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      const record = { ...result, service: 'netlify', timestamp: new Date().toISOString() };
      this.addToHistory(record);
      return record;
    } catch (err) {
      console.error('Netlify publish error:', err);
      throw new Error(`Failed to publish to Netlify: ${err.message}`);
    }
  }

  async publishToGitHubPages(files, projectName) {
    if (!CONFIG.github.token || !CONFIG.github.username) {
      throw new Error('GitHub credentials not configured.');
    }

    try {
      const response = await fetch(`${API_URL}/api/publish/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files,
          projectName,
          token: CONFIG.github.token,
          username: CONFIG.github.username
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      const record = { ...result, service: 'github-pages', timestamp: new Date().toISOString() };
      this.addToHistory(record);
      return record;
    } catch (err) {
      console.error('GitHub Pages publish error:', err);
      // Fallback to demo
      if (CONFIG.demoMode) return this.publishToMockService(files, projectName);
      throw err;
    }
  }

  async publishToVercel(files, projectName) {
  if (!CONFIG.vercel.token) {
    throw new Error('Vercel token not configured.');
  }

  try {
    const fixedFiles = {
      'index.html': files['index.html'] || '<!DOCTYPE html><html><head><title>Default</title></head><body><h1>Hello World</h1></body></html>',
      'styles.css': files['styles.css'] || '/* Default CSS */ body { font-family: Arial; }',
      'script.js': files['script.js'] || '// Default JS\nconsole.log("Hello World");'
    };

    if (!fixedFiles['index.html']) {
      throw new Error('index.html is required.');
    }

    const formData = new FormData();
    for (const [filename, content] of Object.entries(fixedFiles)) {
      formData.append('files', new Blob([content]), filename);
    }

    const response = await fetch(`${VERCEL_API_BASE}/v9/deployments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONFIG.vercel.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Vercel API error: ${response.status}`);
    }

    const result = await response.json();
    const record = {
      id: result.id,
      name: projectName,
      url: `https://${result.alias || result.url}`,
      service: 'vercel',
      timestamp: new Date().toISOString(),
      status: 'published',
      files: Object.keys(fixedFiles),
      deploymentUrl: result.inspectorUrl
    };

    this.addToHistory(record);
    return record;
  } catch (err) {
    console.error('Vercel publish error:', err);
    throw new Error(`Failed to publish to Vercel: ${err.message}`);
  }
}


async publishToMockService(files, projectName) {
  await new Promise((res) => setTimeout(res, 500)); // simulate delay

  const projectId = Math.random().toString(36).substring(2, 10);

  // Clean up files content - make sure they are strings
  const cleanedFiles = {};
  for (const [key, content] of Object.entries(files)) {
    cleanedFiles[key] = content || "";
  }

  const record = {
    id: projectId,
    name: projectName,
    url: `${import.meta.env.FRONTEND_URL || 'http://localhost:5173'}/mock/${projectId}`,
    service: "web-builder",
    timestamp: new Date().toISOString(),
    status: "published",
    files: cleanedFiles,
  };

  // Get existing history, add new record, save back
  const history = JSON.parse(localStorage.getItem("publishHistory") || "[]");
  history.unshift(record);
  localStorage.setItem("publishHistory", JSON.stringify(history));

  return record;
}


  async publish(files, projectName, service = 'netlify') {
    if (service === 'netlify') return this.publishToNetlify(files, projectName);
    if (service === 'github-pages') return this.publishToGitHubPages(files, projectName);
    if (service === 'vercel') return this.publishToVercel(files, projectName);
    return this.publishToMockService(files, projectName);
  }

  async updateProject(publishId, files) {
    const record = this.publishHistory.find(r => r.id === publishId);
    if (!record) throw new Error('Publish record not found');

    if (record.service === 'ai-web-builder') {
      await new Promise(res => setTimeout(res, 1500));
      record.timestamp = new Date().toISOString();
      record.files = Object.keys(files);
      localStorage.setItem('publishHistory', JSON.stringify(this.publishHistory));
      return record;
    }
    throw new Error('Update not implemented for this service');
  }

  async deleteProject(publishId) {
    this.publishHistory = this.publishHistory.filter(r => r.id !== publishId);
    localStorage.setItem('publishHistory', JSON.stringify(this.publishHistory));
  }
}

// Available services
export const getAvailableServices = () => {
  const services = [
    { id: 'ai-web-builder', name: 'AI Web Builder (Demo)', available: true, free: true, description: 'Free demo hosting for testing' }
  ];

  if (isServiceConfigured('netlify')) services.push({ id: 'netlify', name: 'Netlify', available: true, free: true, description: 'Professional hosting with SSL' });
  if (isServiceConfigured('github-pages')) services.push({ id: 'github-pages', name: 'GitHub Pages', available: true, free: true, description: 'Host on GitHub with version control' });
  if (isServiceConfigured('vercel')) services.push({ id: 'vercel', name: 'Vercel', available: true, free: true, description: 'Modern hosting with edge functions' });

  return services;
};

export const hasRealServices = () => {
  return isServiceConfigured('netlify') || isServiceConfigured('github-pages') || isServiceConfigured('vercel');
};

export const getServiceStatus = () => ({
  netlify: isServiceConfigured('netlify'),
  github: isServiceConfigured('github-pages'),
  vercel: isServiceConfigured('vercel'),
  demoMode: CONFIG.demoMode
});

export const publishService = new PublishService();

export const generateShareableLink = (publishRecord) => ({
  title: publishRecord.name,
  text: `Check out this AI-generated web project: ${publishRecord.name}`,
  url: publishRecord.url
});

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
};