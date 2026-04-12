const express = require('express');
const router = express.Router();
const groq = require('../config/groq');
const { requireAuth } = require('../middleware/auth');

// Validate and fix file structure for deployment
const validateAndFixFiles = (files) => {
  const validatedFiles = { ...files };
  
  // Ensure we have index.html
  if (!validatedFiles['index.html'] || !validatedFiles['index.html'].trim()) {
    validatedFiles['index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome</h1>
        <p>This is an AI-generated web application.</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  }
  
  // Ensure we have styles.css
  if (!validatedFiles['styles.css'] || !validatedFiles['styles.css'].trim()) {
    validatedFiles['styles.css'] = `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}
.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
h1 {
    color: #333;
    text-align: center;
}`;
  }
  
  // Ensure we have script.js
  if (!validatedFiles['script.js'] || !validatedFiles['script.js'].trim()) {
    validatedFiles['script.js'] = `console.log('AI Generated Project loaded successfully');
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page is ready!');
});`;
  }
  
  // Ensure HTML links to external files
  let html = validatedFiles['index.html'];
  if (!html.includes('href="styles.css"')) {
    html = html.replace('</head>', '    <link rel="stylesheet" href="styles.css">\n</head>');
  }
  if (!html.includes('src="script.js"')) {
    html = html.replace('</body>', '    <script src="script.js"></script>\n</body>');
  }
  validatedFiles['index.html'] = html;
  
  console.log('File validation completed. Files:', Object.keys(validatedFiles));
  return validatedFiles;
};

// Generate endpoint
router.post('/',requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("part1");
    console.log(req.user._id);
    if (!prompt) throw new Error("Prompt is required");

    const enhancedPrompt = `
Generate a complete web application based on this request: "${prompt}"

IMPORTANT: Please provide THREE separate files with clean separation of concerns:

1. HTML file (index.html): Structure only, no inline CSS or JavaScript
2. CSS file (styles.css): All styling, including responsive design and animations
3. JavaScript file (script.js): All interactive functionality

Please provide the response in this EXACT JSON format:
{
  "files": {
    "index.html": "...",
    "styles.css": "...",
    "script.js": "..."
  }
}
`;
    console.log("part2");
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "You are a professional web app generator also try to add images, animations, and interactive elements in that" },
        { role: "user", content: enhancedPrompt }
      ],
      temperature: 0.7,
      max_tokens: 6000
    });

    let aiResponse = completion.choices[0].message.content;
    console.log("part3");
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        const validatedFiles = validateAndFixFiles(parsedResponse.files || {});
        return res.json({ files: validatedFiles });
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }

    // fallback
    res.json({
      files: validateAndFixFiles({
        "index.html": "<!DOCTYPE html><html><body><h1>Fallback</h1></body></html>",
        "styles.css": "body{font-family:sans-serif}",
        "script.js": "console.log('fallback')"
      })
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      files: validateAndFixFiles({
        "index.html": "<h1>Service Unavailable</h1>"
      })
    });
  }
});

module.exports = router;
