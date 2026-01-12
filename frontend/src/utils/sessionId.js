// Generate or get session ID for guest users
export const getSessionId = () => {
  let sessionId = localStorage.getItem('guestSessionId');
  
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestSessionId', sessionId);
  }
  
  return sessionId;
};

export const clearSessionId = () => {
  localStorage.removeItem('guestSessionId');
};