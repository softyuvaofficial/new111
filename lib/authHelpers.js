// lib/authHelpers.js

/**
 * Check if the user has admin role
 * @param {object} user - Supabase user object with user_metadata
 * @returns {boolean}
 */
export function isAdmin(user) {
  if (!user) return false;
  const roles = user.user_metadata?.roles || [];
  return roles.includes("admin");
}

/**
 * Check if the user has mentor role
 * @param {object} user
 * @returns {boolean}
 */
export function isMentor(user) {
  if (!user) return false;
  const roles = user.user_metadata?.roles || [];
  return roles.includes("mentor");
}

/**
 * Check if user is logged in
 * @param {object} user
 * @returns {boolean}
 */
export function isLoggedIn(user) {
  return !!user;
}

/**
 * Extract basic user info from Supabase user object
 * @param {object} user
 * @returns {{id: string, email: string, roles: string[]}} user info
 */
export function getUserInfo(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    roles: user.user_metadata?.roles || [],
  };
}

/**
 * Add a role to user metadata (should be done server-side)
 * @param {object} userMetadata
 * @param {string} role
 * @returns {object} updated metadata
 */
export function addRole(userMetadata, role) {
  const roles = userMetadata?.roles || [];
  if (!roles.includes(role)) {
    roles.push(role);
  }
  return { ...userMetadata, roles };
}

/**
 * Remove a role from user metadata (should be done server-side)
 * @param {object} userMetadata
 * @param {string} role
 * @returns {object} updated metadata
 */
export function removeRole(userMetadata, role) {
  const roles = userMetadata?.roles || [];
  return { ...userMetadata, roles: roles.filter((r) => r !== role) };
}
