const geminiMigration = {
  title: "Gemini API Migration Guide",
  overview: {
    description: "Migration guide for transitioning from current AI service to Google Gemini API",
    targetService: "Google Gemini API",
    migrationDate: "2025-07-19"
  },
  steps: [
    {
      id: 1,
      title: "API Key Setup",
      description: "Configure Gemini API credentials",
      tasks: [
        "Obtain Gemini API key from Google AI Studio",
        "Add GEMINI_API_KEY to environment variables",
        "Update configuration files"
      ]
    },
    {
      id: 2,
      title: "Code Migration",
      description: "Update API calls and request/response handling",
      tasks: [
        "Replace existing API endpoints",
        "Update request format",
        "Modify response parsing"
      ]
    },
    {
      id: 3,
      title: "Testing",
      description: "Validate migration success",
      tasks: [
        "Test API connectivity",
        "Verify response accuracy",
        "Performance benchmarking"
      ]
    }
  ],
  configuration: {
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta",
    model: "gemini-1.5-pro",
    maxTokens: 8192,
    temperature: 0.7
  },
  notes: [
    "Backup existing implementation before migration",
    "Monitor API usage and costs",
    "Update documentation after migration"
  ]
};

module.exports = geminiMigration;