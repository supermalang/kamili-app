import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Format currency in FCFA
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '0 FCFA'

  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' FCFA'
}

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy HH:mm')
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatStr = 'dd/MM/yyyy HH:mm') {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatStr, { locale: fr })
  } catch (error) {
    console.error('Date formatting error:', error)
    return '-'
  }
}

/**
 * Format date only (no time)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDateOnly(date) {
  return formatDate(date, 'dd/MM/yyyy')
}

/**
 * Format time only (no date)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time string
 */
export function formatTimeOnly(date) {
  return formatDate(date, 'HH:mm')
}

/**
 * Format relative time (e.g., "il y a 2 heures")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr })
  } catch (error) {
    console.error('Relative time formatting error:', error)
    return '-'
  }
}

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhone(phone) {
  if (!phone) return '-'

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')

  // Format as XX XX XX XX XX
  if (cleaned.length >= 9) {
    return cleaned.match(/.{1,2}/g).join(' ')
  }

  return phone
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 50) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined) return '0%'
  return value.toFixed(decimals) + '%'
}

/**
 * Format number with separators
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(number) {
  if (number === null || number === undefined) return '0'
  return new Intl.NumberFormat('fr-FR').format(number)
}
