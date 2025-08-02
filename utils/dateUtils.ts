import type { FormattedDateTime } from "@/types"

/**
 * Formats a date-time string into a readable format
 */
export const formatDateTime = (dateTimeString: string): FormattedDateTime => {
  const date = new Date(dateTimeString)

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string provided")
  }

  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  }
}

/**
 * Checks if a date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString)
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Checks if a date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  const now = new Date()

  return date.getTime() > now.getTime()
}
