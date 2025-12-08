// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'En attente',
  [ORDER_STATUS.CONFIRMED]: 'Confirmée',
  [ORDER_STATUS.PREPARING]: 'En préparation',
  [ORDER_STATUS.READY]: 'Prête',
  [ORDER_STATUS.DELIVERING]: 'En livraison',
  [ORDER_STATUS.DELIVERED]: 'Livrée',
  [ORDER_STATUS.CANCELLED]: 'Annulée'
}

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.CONFIRMED]: 'info',
  [ORDER_STATUS.PREPARING]: 'primary',
  [ORDER_STATUS.READY]: 'success',
  [ORDER_STATUS.DELIVERING]: 'primary',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger'
}

// Order types
export const ORDER_TYPE = {
  DELIVERY: 'delivery',
  TAKEAWAY: 'takeaway'
}

export const ORDER_TYPE_LABELS = {
  [ORDER_TYPE.DELIVERY]: 'Livraison',
  [ORDER_TYPE.TAKEAWAY]: 'À emporter'
}

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
}

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'En attente',
  [PAYMENT_STATUS.PAID]: 'Payé',
  [PAYMENT_STATUS.FAILED]: 'Échoué',
  [PAYMENT_STATUS.REFUNDED]: 'Remboursé'
}

// Payment methods
export const PAYMENT_METHOD = {
  WAVE: 'wave',
  MAXIT: 'maxit',
  DJAMO: 'djamo',
  CARD: 'card',
  CASH: 'cash'
}

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD.WAVE]: 'Wave',
  [PAYMENT_METHOD.MAXIT]: 'MaxIt',
  [PAYMENT_METHOD.DJAMO]: 'Djamo',
  [PAYMENT_METHOD.CARD]: 'Carte bancaire',
  [PAYMENT_METHOD.CASH]: 'Espèces'
}

// Product types
export const PRODUCT_TYPE = {
  PIZZA: 'pizza',
  DRINK: 'drink',
  DESSERT: 'dessert',
  SIDE: 'side'
}

export const PRODUCT_TYPE_LABELS = {
  [PRODUCT_TYPE.PIZZA]: 'Pizza',
  [PRODUCT_TYPE.DRINK]: 'Boisson',
  [PRODUCT_TYPE.DESSERT]: 'Dessert',
  [PRODUCT_TYPE.SIDE]: 'Accompagnement'
}

// Loyalty tiers
export const LOYALTY_TIER = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold'
}

export const LOYALTY_TIER_LABELS = {
  [LOYALTY_TIER.BRONZE]: 'Bronze',
  [LOYALTY_TIER.SILVER]: 'Argent',
  [LOYALTY_TIER.GOLD]: 'Or'
}

export const LOYALTY_TIER_COLORS = {
  [LOYALTY_TIER.BRONZE]: '#CD7F32',
  [LOYALTY_TIER.SILVER]: '#C0C0C0',
  [LOYALTY_TIER.GOLD]: '#FFD700'
}

// User roles
export const USER_ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  CHEF: 'chef',
  DELIVERY: 'delivery'
}

export const USER_ROLE_LABELS = {
  [USER_ROLE.ADMIN]: 'Administrateur',
  [USER_ROLE.MANAGER]: 'Manager',
  [USER_ROLE.STAFF]: 'Personnel',
  [USER_ROLE.CHEF]: 'Chef',
  [USER_ROLE.DELIVERY]: 'Livreur'
}

// Pagination
export const DEFAULT_PAGE_SIZE = 25
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

// Date ranges for reports
export const DATE_RANGE = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  CUSTOM: 'custom'
}

export const DATE_RANGE_LABELS = {
  [DATE_RANGE.TODAY]: "Aujourd'hui",
  [DATE_RANGE.YESTERDAY]: 'Hier',
  [DATE_RANGE.LAST_7_DAYS]: '7 derniers jours',
  [DATE_RANGE.LAST_30_DAYS]: '30 derniers jours',
  [DATE_RANGE.THIS_MONTH]: 'Ce mois-ci',
  [DATE_RANGE.LAST_MONTH]: 'Mois dernier',
  [DATE_RANGE.CUSTOM]: 'Personnalisé'
}

// Notification types
export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Delivery fee
export const DELIVERY_FEE = 1000
export const FREE_DELIVERY_THRESHOLD = 10000
