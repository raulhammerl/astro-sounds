// Constants for storage keys
const USER_KEY = 'sounds_log_user';

// Helper to format names consistently
const formatName = (name) => name.trim().toUpperCase().substring(0, 15); // Limit length

// Get currently saved user
export function getUser() {
  if (typeof window === 'undefined') return null; // Server-side safety guard
  return localStorage.getItem(USER_KEY);
}

// Save new user
export function saveUser(name) {
  if (!name) return null;
  const formatted = formatName(name);
  localStorage.setItem(USER_KEY, formatted);
  return formatted;
}

// The main function to get or prompt for identity
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
