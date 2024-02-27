const { createProxyMiddleware } = require('http-proxy-middleware');

// Export a function that takes the Express app object as an argument
module.exports = function(app) {
  // Define the proxy middleware using the createProxyMiddleware function
  const proxyMiddleware = createProxyMiddleware({
    // The target URL to proxy requests to. Change this to your backend server's address.
    target: process.env.REACT_APP_BACKEND_URL,
    // Set to true to modify the origin header to match the target URL.
    changeOrigin: true,
    // Disable SSL certificate validation if using self-signed certificates.
    // Note: Remove this option if using valid SSL certificates signed by a trusted authority.
    secure: false,
    // Enable debugging to log proxy-related information.
    logLevel: 'debug'
  });

  // Apply the proxy middleware to specific routes.
  // This means any request to these routes from your frontend application will be proxied to the backend server.
  app.use('/account', proxyMiddleware);       // Proxy requests made to /account to the backend server.
  app.use('/user', proxyMiddleware);          // Proxy requests made to /user to the backend server.
  app.use('/transactions', proxyMiddleware);  // Proxy requests made to /transactions to the backend server.
  
  // Note: You can add as many routes as needed, or use a wildcard '*' to proxy all requests.
  // However, be cautious with the wildcard approach, as it might proxy requests you didn't intend to,
  // such as requests for static assets or API calls that should go elsewhere.
};
