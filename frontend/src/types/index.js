// Converted from TypeScript interfaces to JSDoc typedefs

/**
 * @typedef {Object} BannerConfig
 * @property {string} theme
 * @property {string[]} products
 * @property {string} offer
 * @property {string[]} colorPalette
 * @property {File} [uploadedImage]
 * @property {string} [prompt]
 */

/**
 * @typedef {Object} Theme
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {string[]} colors
 */

/**
 * @typedef {Object} Preset
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {Partial<BannerConfig>} config
 * @property {string} [thumbnail]
 */

/**
 * @typedef {Object} ToastMessage
 * @property {'success'|'error'|'info'|'warning'} type
 * @property {string} id
 * @property {string} title
 * @property {string} [message]
 * @property {number} [duration]
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} isAuthenticated
 * @property {User|null} user
 * @property {boolean} isLoading
 */