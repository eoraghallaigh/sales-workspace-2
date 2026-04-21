import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TodayCard = () => {
  return (
    <Card className="min-h-[200px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="heading-200">Today, Jul 31</CardTitle>
        <div className="flex gap-1">
          <Button variant="secondary-alt" size="extra-small" className="p-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary-alt" size="extra-small" className="p-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Wireframe content placeholder */}
        <div className="space-y-3">
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayCard;