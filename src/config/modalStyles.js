/**
 * Reusable Modal and Backdrop Style Configurations
 *
 * This file contains standardized styling specifications for modals
 * and backdrops used throughout the application.
 */

export const modalStyles = {
  /**
   * Backdrop specifications
   * Used for the overlay behind modal popups
   */
  backdrop: {
    blur: '10px',
    transparency: 0.2, // 20% transparent (80% opaque)
    backgroundColor: 'rgba(254, 255, 255, 0.2)',
    // Tailwind class
    blurClass: 'backdrop-blur-[10px]',
  },

  /**
   * Modal/Popup specifications
   * Used for the modal container itself
   */
  modal: {
    blur: '80px',
    // Tailwind class
    blurClass: 'backdrop-blur-[80px]',
    // Gradient background with 90% opacity
    backgroundGradient: 'bg-gradient-to-br from-pink-50/90 via-yellow-50/90 to-green-50/90',
  },

  /**
   * Form input specifications
   */
  formInput: {
    borderColor: '#908686',
    borderStyle: 'border: 1px solid #908686;',
    focusRingColor: 'focus:ring-red-500',
  },

  /**
   * Modal title specifications
   */
  title: {
    backgroundColor: '#3C3C3C',
    textColor: 'white',
    fontFamily: 'Inter, sans-serif',
    fontSize: '20px',
    fontWeight: 700,
    fontStyle: 'bold',
  },
}

/**
 * Helper function to get backdrop inline styles
 * @returns {string} CSS style string for backdrop
 */
export const getBackdropStyles = () => {
  return `background-color: ${modalStyles.backdrop.backgroundColor};`
}

/**
 * Helper function to get backdrop classes
 * @returns {string} Tailwind classes for backdrop
 */
export const getBackdropClasses = () => {
  return `fixed inset-0 ${modalStyles.backdrop.blurClass} transition-all`
}

/**
 * Helper function to get modal container classes
 * @returns {string} Tailwind classes for modal
 */
export const getModalClasses = () => {
  return `relative rounded-lg shadow-xl max-w-md w-full overflow-hidden ${modalStyles.modal.blurClass} ${modalStyles.modal.backgroundGradient}`
}

/**
 * Helper function to get form input border style
 * @returns {string} CSS style string for form inputs
 */
export const getFormInputBorderStyle = () => {
  return modalStyles.formInput.borderStyle
}

/**
 * Helper function to get modal title styles
 * @returns {string} CSS style string for modal title
 */
export const getModalTitleStyle = () => {
  return `background-color: ${modalStyles.title.backgroundColor}; font-family: ${modalStyles.title.fontFamily}; font-size: ${modalStyles.title.fontSize}; font-weight: ${modalStyles.title.fontWeight}; font-style: ${modalStyles.title.fontStyle};`
}

export default modalStyles
