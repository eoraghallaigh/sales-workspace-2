import type { RecentConversion } from "@/data/companyCards";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentConversionsCardProps {
  conversions: RecentConversion[];
  onContactClick?: (contactId: string) => void;
}

const RecentConversionsCard = ({ conversions, onContactClick }: RecentConversionsCardProps) => {
  if (conversions.length === 0) {
    return (
      <p className="body-100 text-muted-foreground py-2">
        No conversions in the last 90 days.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="heading-50 text-foreground">Contact</TableHead>
          <TableHead className="heading-50 text-foreground">Recent conversion</TableHead>
          <TableHead className="heading-50 text-foreground">Last touch</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {conversions.map((c) => (
          <TableRow key={c.contactId} className="align-top">
            <TableCell className="py-3">
              <button
                type="button"
                className="body-125 text-text-interactive hover:underline text-left"
                onClick={() => onContactClick?.(c.contactId)}
              >
                {c.contactName}
              </button>
            </TableCell>
            <TableCell className="py-3">
              <div className="body-100 text-foreground">{c.conversion}</div>
              <div className="detail-200 text-muted-foreground">{c.conversionWhen}</div>
            </TableCell>
            <TableCell className="py-3">
              <div className="body-100 text-foreground">{c.lastTouchWhen}</div>
              <div className="detail-200 text-muted-foreground">
                <span className="text-text-interactive">{c.lastTouchBy}</span> {c.lastTouchAction}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentConversionsCard;
