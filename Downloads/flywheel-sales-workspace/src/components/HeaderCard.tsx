import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface HeaderCardProps {
  title: string;
  topRightElement?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const HeaderCard = ({ title, topRightElement, children, className }: HeaderCardProps) => {
  return (
    <Card className={`min-h-[200px] ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="heading-200">{title}</CardTitle>
        {topRightElement && (
          <div className="flex items-center gap-2">
            {topRightElement}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {children || (
          <div className="space-y-3">
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeaderCard;