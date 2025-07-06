import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowBigUp, ArrowBigDown, Loader, Target, Clock, CheckCircle } from "lucide-react";

const AnalyticsCard = (props: {
  title: string;
  value: number;
  isLoading: boolean;
}) => {
  const { title, value, isLoading } = props;

  const getCardConfig = () => {
    switch (title) {
      case "Total Task":
        return {
          icon: Target,
          gradient: "from-blue-500 to-cyan-500",
          bgGradient: "from-blue-50 to-cyan-50",
          textColor: "text-blue-600",
          borderColor: "border-blue-200",
          darkBgGradient: "dark:from-blue-900/20 dark:to-cyan-900/20",
          darkBorderColor: "dark:border-blue-700/50"
        };
      case "Overdue Task":
        return {
          icon: Clock,
          gradient: "from-red-500 to-pink-500",
          bgGradient: "from-red-50 to-pink-50",
          textColor: "text-red-600",
          borderColor: "border-red-200",
          darkBgGradient: "dark:from-red-900/20 dark:to-pink-900/20",
          darkBorderColor: "dark:border-red-700/50"
        };
      case "Completed Task":
        return {
          icon: CheckCircle,
          gradient: "from-green-500 to-emerald-500",
          bgGradient: "from-green-50 to-emerald-50",
          textColor: "text-green-600",
          borderColor: "border-green-200",
          darkBgGradient: "dark:from-green-900/20 dark:to-emerald-900/20",
          darkBorderColor: "dark:border-green-700/50"
        };
      default:
        return {
          icon: Activity,
          gradient: "from-slate-500 to-gray-500",
          bgGradient: "from-slate-50 to-gray-50",
          textColor: "text-slate-600",
          borderColor: "border-slate-200",
          darkBgGradient: "dark:from-slate-900/20 dark:to-gray-900/20",
          darkBorderColor: "dark:border-slate-700/50"
        };
    }
  };

  const getArrowIcon = () => {
    if (title === "Overdue Task") {
      return value > 0 ? (
        <ArrowBigDown strokeWidth={2.5} className="h-4 w-4 text-red-500" />
      ) : (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-green-500" />
      );
    }
    if (title === "Completed Task" || title === "Total Task") {
      return value > 0 ? (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-green-500" />
      ) : (
        <ArrowBigDown strokeWidth={2.5} className="h-4 w-4 text-red-500" />
      );
    }
    return null;
  };

  const config = getCardConfig();
  const IconComponent = config.icon;

  return (
    <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${config.bgGradient} ${config.darkBgGradient} border ${config.borderColor} ${config.darkBorderColor} backdrop-blur-sm`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-r ${config.gradient} shadow-lg`}>
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <CardTitle className={`text-sm font-semibold ${config.textColor} dark:text-white`}>
              {title}
            </CardTitle>
            {getArrowIcon()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader className="w-6 h-6 animate-spin text-slate-400" />
              <span className="text-slate-400">Loading...</span>
            </div>
          ) : (
            value.toLocaleString()
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {title === "Total Task" && "Total tasks in workspace"}
          {title === "Overdue Task" && "Tasks past due date"}
          {title === "Completed Task" && "Successfully completed"}
        </p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
