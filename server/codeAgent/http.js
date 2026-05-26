export function sendJson(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

export function allowMethods(request, response, methods) {
  if (methods.includes(request.method)) return true;
  response.setHeader('Allow', methods.join(', '));
  sendJson(response, 405, { error: 'Method not allowed.' });
  return false;
}

export function readBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  if (!request.body) return {};
  try {
    return JSON.parse(request.body);
  } catch {
    return {};
  }
}

export function apiError(response, error) {
  const status = Number(error.statusCode || error.status || 500);
  const message = status >= 500 ? 'The code-agent service could not complete this request.' : error.message;
  if (status >= 500) console.error(error);
  sendJson(response, status, { error: message });
}

export function assert(condition, message, statusCode = 400) {
  if (condition) return;
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}
