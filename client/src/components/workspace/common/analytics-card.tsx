import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, TrendingUp, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";

type AnalyticsCardType = "total" | "overdue" | "completed";

interface AnalyticsCardProps {
  title: string;
  value: number;
  isLoading: boolean;
  type?: AnalyticsCardType;
}

const AnalyticsCard = (props: AnalyticsCardProps) => {
  const { title, value, isLoading, type = "total" } = props;
  const [displayValue, setDisplayValue] = useState(0);

  // Animate number counting
  useEffect(() => {
    if (!isLoading && value > 0) {
      let start = 0;
      const increment = value / 20;
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 50);
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, isLoading]);

  const getCardConfig = () => {
    switch (type) {
      case "overdue":
        return {
          icon: Clock,
          iconColor: "text-red-500",
          bgGradient: "bg-gradient-to-br from-red-50 to-red-100/50",
          borderColor: "border-red-200/50",
          valueColor: "text-red-600",
          glowColor: "shadow-red-500/10",
          description: value > 0 ? "Need attention" : "All caught up!",
        };
      case "completed":
        return {
          icon: Target,
          iconColor: "text-green-500",
          bgGradient: "bg-gradient-to-br from-green-50 to-green-100/50",
          borderColor: "border-green-200/50",
          valueColor: "text-green-600",
          glowColor: "shadow-green-500/10",
          description: "Tasks completed",
        };
      default:
        return {
          icon: TrendingUp,
          iconColor: "text-blue-500",
          bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100/50",
          borderColor: "border-blue-200/50",
          valueColor: "text-blue-600",
          glowColor: "shadow-blue-500/10",
          description: "Active tasks",
        };
    }
  };

  const config = getCardConfig();
  const IconComponent = config.icon;

  return (
    <Card className={`min-w-[280px] relative overflow-hidden bg-white border ${config.borderColor} rounded-3xl shadow-xl ${config.glowColor} hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group`}>
      <div className={`absolute inset-0 ${config.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              {title}
            </CardTitle>
          </div>
          <div className={`p-3 bg-white rounded-2xl shadow-lg ${config.glowColor} group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className={`text-5xl font-bold ${config.valueColor} mb-3 leading-none`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-14">
              <Loader className="w-10 h-10 animate-spin text-gray-400" />
            </div>
          ) : (
            <span className="tabular-nums">{displayValue}</span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <div className={`w-2 h-2 ${config.valueColor.replace('text-', 'bg-')} rounded-full mr-2 animate-pulse`}></div>
          <span className="font-medium">{config.description}</span>
        </div>
        
        {/* Decorative element */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
