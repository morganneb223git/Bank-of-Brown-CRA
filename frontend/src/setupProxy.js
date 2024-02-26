// Import the http-proxy-middleware package. This package provides a way to create a proxy middleware
// for connecting your frontend application with a backend server, especially useful during development
// to avoid CORS issues and to simulate a single domain environment.
const { createProxyMiddleware } = require('http-proxy-middleware');

// This module exports a function that takes the Express app object as an argument.
// It's designed to be used in the 'src/setupProxy.js' file of a Create React App (CRA) project.
module.exports = function(app) {
  // Define the proxy middleware using the createProxyMiddleware function.
  // The options object passed to this function can be customized to fit your proxy needs.
  const proxyMiddleware = createProxyMiddleware({
    target: 'https://bank-of-brown-4a50fa93ed19.herokuapp.com/', // The target URL to proxy requests to. Change this to your backend server's address.
    changeOrigin: true, // Set to true to modify the origin header to match the target URL.
    // This is particularly useful to bypass Host/origin checks performed by the backend.
    logLevel: 'debug', // Enable debugging 
  });

  // Apply the proxy middleware to specific routes.
  // This means any request to these routes from your frontend application will be proxied to the backend server.
  app.use('/account', proxyMiddleware); // Proxy requests made to /account to the backend server.
  app.use('/user', proxyMiddleware);    // Proxy requests made to /user to the backend server.
  app.use('/transactions', proxyMiddleware); // Proxy requests made to /transactions to the backend server.
  
  // Note: You can add as many routes as needed, or use a wildcard '*' to proxy all requests.
  // However, be cautious with the wildcard approach, as it might proxy requests you didn't intend to,
  // such as requests for static assets or API calls that should go elsewhere.
};