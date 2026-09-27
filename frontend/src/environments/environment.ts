export const environment = {
  production: false,
  apiUrl: (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:8080/api'
    : 'https://project-management-1-8cue.onrender.com/api'
};
