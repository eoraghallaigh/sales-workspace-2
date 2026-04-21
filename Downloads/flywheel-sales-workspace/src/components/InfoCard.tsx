import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InfoCardProps {
  title: string;
  showViewAll?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const InfoCard = ({ title, showViewAll = true, children, className }: InfoCardProps) => {
  return (
    <Card className={`min-h-[240px] ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="heading-200">{title}</CardTitle>
        {showViewAll && (
          <Button variant="secondary-alt" size="small">
            View all
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {children || (
          <div className="space-y-3">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
            <div className="h-3 bg-muted rounded w-4/5"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;