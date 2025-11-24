import { Card, CardContent } from "../ui/card";
import { Phone, MessageCircle, Users, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats: {
    phoneConversations: number;
    whatsappMessages: number;
    activeLeads: number;
    conversionRate: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      title: "Conversaciones Telefónicas",
      value: stats.phoneConversations,
      subtitle: "Este mes", 
      icon: Phone,
      color: "blue"
    },
    {
      title: "Mensajes WhatsApp",
      value: stats.whatsappMessages,
      subtitle: "Este mes",
      icon: MessageCircle, 
      color: "green"
    },
    {
      title: "Leads Activos",
      value: stats.activeLeads,
      subtitle: "Total",
      icon: Users,
      color: "purple"
    },
    {
      title: "Tasa de Conversión", 
      value: `${stats.conversionRate}%`,
      subtitle: "Este mes",
      icon: TrendingUp,
      color: "primary"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600';
      case 'green': 
        return 'bg-green-50 text-green-600';
      case 'purple':
        return 'bg-purple-50 text-purple-600';
      case 'primary':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}