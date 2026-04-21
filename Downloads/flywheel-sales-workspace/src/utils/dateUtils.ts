/**
 * Determines if a task's due date is overdue
 * Only "Yesterday" or earlier dates are considered overdue
 * "Today" is NOT overdue
 */
export function isDateOverdue(dueDateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  switch (dueDateString.toLowerCase()) {
    case "today":
      return false;
    case "tomorrow":
      return false;
    case "yesterday":
      return true;
    case "this week":
      return false;
    case "next week":
      return false;
    default:
      // For calendar dates, parse and compare
      try {
        const dueDate = new Date(dueDateString);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
      } catch {
        // If parsing fails, assume not overdue
        return false;
      }
  }
}

/**
 * Formats a due date for display
 * Returns "Today", "Tomorrow", or "Yesterday" for those cases
 * Returns formatted calendar date for all other dates
 */
export function formatDueDate(dueDateString: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Handle relative date strings
  switch (dueDateString.toLowerCase()) {
    case "today":
      return "Today";
    case "tomorrow":
      return "Tomorrow";
    case "yesterday":
      return "Yesterday";
    case "this week":
    case "next week":
      // For "this week" and "next week", try to convert to actual date
      // For now, return as-is (can be enhanced later)
      return dueDateString;
    default:
      // Try to parse as date and format as calendar date
      try {
        const date = new Date(dueDateString);
        // Format as "Nov 17, 2025" or similar
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      } catch {
        // If parsing fails, return original string
        return dueDateString;
      }
  }
}
