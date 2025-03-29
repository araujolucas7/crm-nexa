
// Define our constant keys for storage
const STORAGE_KEYS = {
  USERS: 'nexa_users',
  CURRENT_USER: 'nexa_current_user',
  CONVERSATIONS: 'nexa_conversations',
  MESSAGES: 'nexa_messages',
  TASKS: 'nexa_tasks',
  DEALS: 'nexa_deals',
};

// Generic set function for localStorage
const setItem = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing data to ${key}:`, error);
  }
};

// Generic get function for localStorage
const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving data from ${key}:`, error);
    return defaultValue;
  }
};

export { STORAGE_KEYS, setItem, getItem };
