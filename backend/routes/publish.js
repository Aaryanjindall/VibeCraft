const express = require('express');
const router = express.Router();
const axios = require('axios');
const JSZip = require('jszip');
const Community = require('../models/Community');
const { requireAuth } = require('../middleware/auth');
require('dotenv').config();

const NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';

// Generate unique project ID
const generateProjectId = () => {
  return Math.random().toString(36).substring(2, 10).toLowerCase();
};

// Netlify publish endpoint
router.post('/netlify', requireAuth, async (req, res) => {
  try {
    const { files, projectName, apiToken } = req.body;
    
    const netlifyToken = apiToken || process.env.NETLIFY_API_TOKEN;
    
    if (!netlifyToken) {
      return res.status(400).json({ error: 'Netlify API token is required' });
    }
    
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    if (!files['index.html']) {
      return res.status(400).json({ error: 'index.html is required for Netlify deployment' });
    }

    console.log(`Deploying to Netlify with files: ${Object.keys(files).join(', ')}`);

    const zip = new JSZip();
    for (const [filename, content] of Object.entries(files)) {
      zip.file(filename, content);
    }
    
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    console.log('Zip buffer created, size:', zipBuffer.length, 'bytes');

    const siteName = `${projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')}-${Date.now()}`;

    console.log('Making request to Netlify API...');
    const createSiteResponse = await axios.post(
      `${NETLIFY_API_BASE}/sites`,
      {
        name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') + '-' + Date.now()
      },
      {
        headers: {
          'Authorization': `Bearer ${netlifyToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const site = createSiteResponse.data;
    console.log('Created Netlify site:', site.id);

    const deployResponse = await axios.post(
      `${NETLIFY_API_BASE}/sites/${site.id}/deploys`,
      zipBuffer,
      {
        headers: {
          'Authorization': `Bearer ${netlifyToken}`,
          'Content-Type': 'application/zip',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    const deployment = deployResponse.data;
    console.log('Deployed to site:', deployment.id, 'URL:', site.ssl_url || site.url);

    // Generate unique project ID
    const projectId = generateProjectId();

    // Auto-create community for this project
    try {
      const existingCommunity = await Community.findOne({ projectId });
      if (!existingCommunity) {
        const community = new Community({
          projectId,
          projectName,
          description: `Community for ${projectName}`,
          createdBy: req.session.userId,
          members: [req.session.userId]
        });
        await community.save();
        console.log(`Auto-created community for project: ${projectId}`);
      }
    } catch (communityError) {
      console.error('Error creating community:', communityError);
      // Don't fail the publish if community creation fails
    }

    const result = {
      id: site.id,
      projectId: projectId, // Add projectId to response
      name: projectName,
      url: site.ssl_url || site.url,
      adminUrl: site.admin_url,
      service: 'netlify',
      timestamp: new Date().toISOString(),
      status: 'published',
      files: Object.keys(files)
    };

    console.log('Netlify deployment completed:', result.url);
    res.json(result);
  } catch (error) {
    console.error('Netlify publish error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    res.status(500).json({ 
      error: `Failed to publish to Netlify: ${error.response?.data?.message || error.message}` 
    });
  }
});

// GitHub Pages publish endpoint
router.post('/github', async (req, res) => {
  try {
    const { files, projectName, token, username } = req.body;
    
    if (!token || !username) {
      return res.status(400).json({ error: 'GitHub token and username are required' });
    }
    
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const repoName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    const createRepoResponse = await axios.post(
      'https://api.github.com/user/repos',
      {
        name: repoName,
        description: `AI Generated Web Project: ${projectName}`,
        public: true,
        auto_init: true
      },
      {
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    const repo = createRepoResponse.data;
    
    for (const [filename, content] of Object.entries(files)) {
      await axios.put(
        `https://api.github.com/repos/${username}/${repoName}/contents/${filename}`,
        {
          message: `Add ${filename}`,
          content: Buffer.from(content).toString('base64'),
          branch: 'main'
        },
        {
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
    }
    
    try {
      await axios.post(
        `https://api.github.com/repos/${username}/${repoName}/pages`,
        {
          source: {
            branch: 'main',
            path: '/'
          }
        },
        {
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
    } catch (pagesError) {
      console.warn('Pages might already be enabled or repo is too new');
    }

    const result = {
      id: repo.id,
      name: projectName,
      url: `https://${username}.github.io/${repoName}`,
      githubUrl: repo.html_url,
      service: 'github-pages',
      timestamp: new Date().toISOString(),
      status: 'published',
      files: Object.keys(files)
    };

    res.json(result);
  } catch (error) {
    console.error('GitHub publish error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: `Failed to publish to GitHub Pages: ${error.response?.data?.message || error.message}` 
    });
  }
});

module.exports = router;
