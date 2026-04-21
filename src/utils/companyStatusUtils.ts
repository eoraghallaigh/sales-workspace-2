import { Company } from "@/components/CompanyCard";

export type CompanyStatus = "New" | "Unworked QL" | "Unworked P1" | "In Progress" | "Over SLA" | "Worked" | "Snoozed" | "Dismissed";

export function calculateCompanyStatus(
  company: Company,
  completedTaskIds: Set<string>
): CompanyStatus {
  // Preserve explicit statuses that shouldn't be auto-calculated
  if (company.status === "New" || company.status === "Over SLA" || company.status === "Snoozed" || company.status === "Dismissed") {
    return company.status;
  }

  // Check if company has a QL contact - QL status takes priority
  const hasQL = company.recommendedContacts.some(c => c.qlData !== undefined);
  
  // If company has a QL, it's always "Unworked QL"
  if (hasQL) {
    return "Unworked QL";
  }
  
  // Count completed touches
  const completedTouches = company.touches.touchStatuses.filter(
    status => status === "completed"
  ).length;
  
  // If all 5 touches are completed, it's Worked
  if (completedTouches === 5) {
    return "Worked";
  }
  
  // If no touches completed, it's Unworked P1
  if (completedTouches === 0) {
    return "Unworked P1";
  }
  
  // If has some touches but not all 5, it's In Progress
  return "In Progress";
}
