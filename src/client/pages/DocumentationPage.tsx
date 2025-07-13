import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const DocumentationPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or support system
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="flex justify-end mb-4">
          <a href="/" className="btn btn-outline text-sm px-4 py-2">&larr; Back to Home</a>
        </div>
        <h1 className="text-5xl font-extrabold mb-8 text-gradient tracking-tight font-sans">Documentation & API</h1>
        {/* API Overview */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-2xl p-6 shadow mb-4">
            <h2 className="text-2xl font-bold mb-2 text-primary-700 dark:text-primary-300 font-sans">API Overview</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-200">
              Resume Plan AI provides a simple REST API for programmatic access to resume generation, job analysis, and template management. Authentication is required for all endpoints.
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 text-sm overflow-x-auto mb-2 font-mono">
              GET /api/v1/resume
              POST /api/v1/resume
              GET /api/v1/job-analysis
              POST /api/v1/job-analysis
              GET /api/v1/templates
            </pre>
            <p className="text-gray-600 dark:text-gray-300 text-xs mb-2">All requests require an Authorization header with your API token.</p>
            <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-x-auto mb-2 font-mono">
              Authorization: Bearer &lt;your-token&gt;
            </pre>
          </div>
        </section>
        {/* Getting Started */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-secondary-100 to-purple-50 dark:from-secondary-900/30 dark:to-purple-900/20 rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-2 text-secondary-700 dark:text-secondary-300 font-sans">Getting Started</h2>
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-200 mb-4">
              <li>Register for an account and log in.</li>
              <li>Navigate to your profile to generate or view your API token.</li>
              <li>Use the API token in your requests as shown above.</li>
            </ol>
          </div>
        </section>
        {/* Example: Generate Resume */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-2 text-primary-700 dark:text-primary-300 font-sans">Example: Generate Resume</h2>
            <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-x-auto mb-2 font-mono">
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
          </div>
        </section>
        {/* Help Center */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300 font-sans">Help Center</h2>
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
          </div>
        </section>
        {/* Contact & Feedback Form */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-4 text-yellow-700 dark:text-yellow-300 font-sans">Contact & Feedback</h2>
            {submitted ? (
              <div className="text-green-600 dark:text-green-300 font-semibold flex items-center gap-2">
                <FiSend className="inline-block mr-1" /> Thank you for your message! We'll get back to you soon.
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold mb-1" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400 font-sans"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-lg shadow hover:scale-105 transition-transform"
                >
                  <FiSend className="inline-block" /> Send Message
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DocumentationPage;
