export const environment = {
  // The backend mounts all routes under /api (see server.js app.use calls, no /v1 prefix).
  // Relative URL + dev-server proxy (proxy.conf.json) because CORS is currently
  // commented out in the backend server.js.
  apiURL: '/api/',
  staticURL: '/uploads/',
  production: false,
};
