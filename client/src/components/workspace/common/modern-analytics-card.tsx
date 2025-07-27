import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, ListTodo, Loader } from "lucide-react";

type AnalyticsCardType = "total" | "overdue" | "completed";

interface AnalyticsCardProps {
  title: string;
  value: number;
  isLoading: boolean;
  type?: AnalyticsCardType;
}

const AnalyticsCard = (props: AnalyticsCardProps) => {
  const { title, value, isLoading, type = "total" } = props;

  const getCardConfig = () => {
    switch (type) {
      case "overdue":
        return {
          icon: AlertTriangle,
          iconColor: "text-red-500",
          bgColor: "bg-red-50",
          valueColor: "text-red-600",
          gradient: "from-red-50 to-red-100",
        };
      case "completed":
        return {
          icon: CheckCircle,
          iconColor: "text-green-500",
          bgColor: "bg-green-50",
          valueColor: "text-green-600",
          gradient: "from-green-50 to-green-100",
        };
      default:
        return {
          icon: ListTodo,
          iconColor: "text-indigo-500",
          bgColor: "bg-indigo-50",
          valueColor: "text-indigo-600",
          gradient: "from-indigo-50 to-indigo-100",
        };
    }
  };

  const config = getCardConfig();
  const IconComponent = config.icon;

  return (
    <Card className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${config.bgColor} rounded-xl`}>
            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className={`text-3xl font-bold ${config.valueColor}`}>
            {isLoading ? (
              <div className="flex items-center justify-start">
                <Loader className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              value
            )}
          </div>
        </div>

        {/* Background gradient */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${config.gradient} opacity-10 rounded-full transform translate-x-16 -translate-y-16`}></div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
