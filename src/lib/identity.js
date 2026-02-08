// Constants for storage keys
const USER_KEY = 'sounds_log_user';
const COMMENT_USER_KEY = 'sounds_log_comment_user';

// Helper to format names consistently
const formatName = (name) => name.trim().toUpperCase().substring(0, 15); // Limit length

// --- Global User Functions ---

// Get currently saved global user
export function getUser() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_KEY);
}

// Save new global user
export function saveUser(name) {
  if (!name) return null;
  const formatted = formatName(name);
  localStorage.setItem(USER_KEY, formatted);
  return formatted;
}

// --- Comment-Specific User Functions ---

// Get currently saved comment user
export function getCommentUser() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(COMMENT_USER_KEY);
}

// Save new comment user
export function saveCommentUser(name) {
  if (!name) return null;
  const formatted = formatName(name);
  localStorage.setItem(COMMENT_USER_KEY, formatted);
  return formatted;
}


// The main function to get or prompt for global identity
export function promptForIdentity() {
  let user = getUser();
  
  if (!user) {
    const input = window.prompt("IDENTIFY YOURSELF [NAME]:");
    if (input) {
      user = saveUser(input);
    } else {
      return null; // User cancelled prompt
    }
  }
  return user;
}
