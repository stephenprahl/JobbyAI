/**
 * Puppeteer Configuration
 * Skip downloading Chromium during installation to speed up builds
 */
module.exports = {
  // Skip Chromium download to improve build performance
  skipDownload: true,

  // If you need Puppeteer later, specify a custom executable path
  // executablePath: '/usr/bin/google-chrome-stable'
};
