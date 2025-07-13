import React from 'react';

const DocumentationPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="flex justify-end mb-4">
        <a href="/" className="btn btn-outline text-sm px-4 py-2">&larr; Back to Home</a>
      </div>
      <h1 className="text-4xl font-bold mb-6 text-gradient">Documentation & API</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">API Overview</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Resume Plan AI provides a simple REST API for programmatic access to resume generation, job analysis, and template management. Authentication is required for all endpoints.
        </p>
        <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 text-sm overflow-x-auto mb-2">
          GET /api/v1/resume
          POST /api/v1/resume
          GET /api/v1/job-analysis
          POST /api/v1/job-analysis
          GET /api/v1/templates
        </pre>
        <p className="text-gray-600 dark:text-gray-300 text-xs mb-2">All requests require an Authorization header with your API token.</p>
        <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-x-auto mb-2">
          Authorization: Bearer &lt;your-token&gt;
        </pre>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
        <ol className="list-decimal list-inside text-gray-700 dark:text-gray-200 mb-4">
          <li>Register for an account and log in.</li>
          <li>Navigate to your profile to generate or view your API token.</li>
          <li>Use the API token in your requests as shown above.</li>
        </ol>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Example: Generate Resume</h2>
        <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-x-auto mb-2">
          curl -X POST https://your-domain.com/api/v1/resume \
          -H "Authorization: Bearer &lt;your-token&gt;" \
          -H "Content-Type: application/json" \
          -d '{'{'}'
          "name": "Jane Doe",
          "email": "jane@example.com",
          "experience": [...],
          "jobTitle": "Software Engineer"
          {'}'}'
        </pre>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Help Center</h2>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Guides</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 mb-4">
            <li><b>How to Generate a Resume:</b> Go to the Resume Builder, fill in your details, and click "Generate" to create a tailored resume.</li>
            <li><b>Using Job Analysis:</b> Paste a job description in the Job Analysis tool to get personalized suggestions for your resume.</li>
            <li><b>Managing Templates:</b> Browse and select templates in the Resume Builder. Your choice will be applied instantly.</li>
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Troubleshooting</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 mb-4">
            <li><b>Resume not generating?</b> Ensure all required fields are filled and try again. If the issue persists, refresh the page or log out and back in.</li>
            <li><b>API errors?</b> Double-check your API token and endpoint URLs. Tokens can be regenerated in your profile.</li>
            <li><b>Payment issues?</b> Verify your card details and ensure your subscription is active. Contact support if problems continue.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Tips</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
            <li>Use industry keywords in your resume for better ATS results.</li>
            <li>Regularly update your profile and resume to reflect your latest experience.</li>
            <li>Try different templates to see which best fits your target job.</li>
            <li>Check the FAQ and Support links in the footer for more help.</li>
          </ul>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Support & Resources</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
          <li>Contact support via the <b>Contact Us</b> link in the footer.</li>
          <li>See <b>Privacy</b>, <b>Terms</b>, and <b>Security</b> for legal and security information.</li>
        </ul>
      </section>
    </div>
  </div>
);

export default DocumentationPage;
