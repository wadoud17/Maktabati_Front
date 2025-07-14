import React from 'react';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import StatCard from '../components/Charts/StatCard';
import AnalyticsChart from '../components/Charts/AnalyticsChart';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { Analytics } from '../types';

const Dashboard: React.FC = () => {
  const { data: analytics, loading } = useApi<Analytics>('http://wadoud.com/api/analytics');

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Produits"
          value="1,234"
          icon={Package}
          color="bg-[#00809D]"
          trend={12}
        />
        <StatCard
          title="Clients Actifs"
          value="567"
          icon={Users}
          color="bg-[#FF7601]"
          trend={8}
        />
        <StatCard
          title="Ventes du Jour"
          value="89"
          icon={ShoppingCart}
          color="bg-[#F3A26D]"
          trend={-3}
        />
        <StatCard
          title="Chiffre d'Affaires"
          value="45,678 MAD"
          icon={TrendingUp}
          color="bg-green-600"
          trend={15}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Produits les Plus Vendus"
          data={analytics?.topProducts || []}
          color="#00809D"
        />
        <AnalyticsChart
          title="Meilleurs Clients"
          data={analytics?.topClients || []}
          color="#FF7601"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Meilleurs Vendeurs"
          data={analytics?.topSellers || []}
          color="#F3A26D"
        />
        <AnalyticsChart
          title="Ventes par Mois"
          data={analytics?.topMonths || []}
          color="#00809D"
        />
      </div>
    </div>
  );
};

export default Dashboard;