/**
 * Service for handling Authentication and Session management.
 */
export const AuthService = {
    /**
     * Checks if a user is currently logged in.
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!localStorage.getItem('planetapp_user');
    },

    /**
     * Gets the current username.
     * @returns {string|null}
     */
    getUser() {
        return localStorage.getItem('planetapp_user');
    },

    /**
     * Logs in the user.
     * @param {string} username 
     */
    login(username) {
        localStorage.setItem('planetapp_user', username);
    },

    /**
     * Logs out the user and redirects to login.
     */
    logout() {
        localStorage.removeItem('planetapp_user');
        localStorage.removeItem('user-id');
        localStorage.removeItem('user-name');
        localStorage.removeItem('user-email');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-telefono');
        window.location.replace('../index.html');
    }
};
