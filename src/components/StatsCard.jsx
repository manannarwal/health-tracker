import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCard({ title, value, icon: Icon, description, trend }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p className="text-xs text-green-600 font-medium">{trend}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
