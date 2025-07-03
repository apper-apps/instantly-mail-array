import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import MetricCard from '@/components/molecules/MetricCard';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { campaignService } from '@/services/api/campaignService';
import { emailThreadService } from '@/services/api/emailThreadService';

const AnalyticsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [campaignsData, threadsData] = await Promise.all([
        campaignService.getAll(),
        emailThreadService.getAll()
      ]);
      setCampaigns(campaignsData);
      setThreads(threadsData);
    } catch (err) {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalSent = campaigns.reduce((sum, c) => sum + (c.metrics?.sent || 0), 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + (c.metrics?.opened || 0), 0);
  const totalClicked = campaigns.reduce((sum, c) => sum + (c.metrics?.clicked || 0), 0);
  const totalReplied = campaigns.reduce((sum, c) => sum + (c.metrics?.replied || 0), 0);
  const totalBounced = campaigns.reduce((sum, c) => sum + (c.metrics?.bounced || 0), 0);

  const openRate = totalSent > 0 ? (totalOpened / totalSent * 100).toFixed(1) : 0;
  const clickRate = totalSent > 0 ? (totalClicked / totalSent * 100).toFixed(1) : 0;
  const replyRate = totalSent > 0 ? (totalReplied / totalSent * 100).toFixed(1) : 0;
  const bounceRate = totalSent > 0 ? (totalBounced / totalSent * 100).toFixed(1) : 0;

  // Chart data
  const campaignPerformanceData = {
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: campaigns.slice(0, 5).map(c => c.name),
      },
      yaxis: {
        title: { text: 'Number of Emails' }
      },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " emails"
          }
        }
      },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ef4444']
    },
    series: [
      {
        name: 'Sent',
        data: campaigns.slice(0, 5).map(c => c.metrics?.sent || 0)
      },
      {
        name: 'Opened',
        data: campaigns.slice(0, 5).map(c => c.metrics?.opened || 0)
      },
      {
        name: 'Clicked',
        data: campaigns.slice(0, 5).map(c => c.metrics?.clicked || 0)
      },
      {
        name: 'Replied',
        data: campaigns.slice(0, 5).map(c => c.metrics?.replied || 0)
      }
    ]
  };

  const conversionFunnelData = {
    options: {
      chart: {
        type: 'donut',
        height: 350
      },
      labels: ['Sent', 'Opened', 'Clicked', 'Replied'],
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
    series: [totalSent, totalOpened, totalClicked, totalReplied]
  };

  const timeSeriesData = {
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      title: {
        text: 'Email Performance Over Time',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      colors: ['#6366f1', '#10b981', '#ef4444']
    },
    series: [
      {
        name: 'Sent',
        data: [120, 145, 167, 189, 210, 245, 267]
      },
      {
        name: 'Opened',
        data: [65, 78, 89, 102, 115, 134, 142]
      },
      {
        name: 'Replied',
        data: [12, 15, 18, 22, 25, 28, 31]
      }
    ]
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading type="cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error
          title="Failed to load analytics"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Monitor your email campaign performance</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Open Rate"
          value={`${openRate}%`}
          change={`${totalOpened} opens`}
          changeType="positive"
          icon="Eye"
          gradient
        />
        <MetricCard
          title="Click Rate"
          value={`${clickRate}%`}
          change={`${totalClicked} clicks`}
          changeType="positive"
          icon="MousePointer"
          gradient
        />
        <MetricCard
          title="Reply Rate"
          value={`${replyRate}%`}
          change={`${totalReplied} replies`}
          changeType="positive"
          icon="MessageSquare"
          gradient
        />
        <MetricCard
          title="Bounce Rate"
          value={`${bounceRate}%`}
          change={`${totalBounced} bounces`}
          changeType="negative"
          icon="AlertTriangle"
          gradient
        />
      </motion.div>

      {/* Additional Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <MetricCard
          title="Total Emails Sent"
          value={totalSent.toLocaleString()}
          icon="Send"
          gradient
        />
        <MetricCard
          title="Active Campaigns"
          value={campaigns.filter(c => c.status === 'active').length}
          icon="Play"
          gradient
        />
        <MetricCard
          title="Avg. Response Time"
          value="2.3 hours"
          icon="Clock"
          gradient
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Campaign Performance
            </h3>
            <Chart
              options={campaignPerformanceData.options}
              series={campaignPerformanceData.series}
              type="bar"
              height={350}
            />
          </Card>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conversion Funnel
            </h3>
            <Chart
              options={conversionFunnelData.options}
              series={conversionFunnelData.series}
              type="donut"
              height={350}
            />
          </Card>
        </motion.div>
      </div>

      {/* Time Series Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <Chart
            options={timeSeriesData.options}
            series={timeSeriesData.series}
            type="line"
            height={350}
          />
        </Card>
      </motion.div>

      {/* Campaign Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Campaign Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Open Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Click Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reply Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.slice(0, 10).map((campaign) => {
                  const sent = campaign.metrics?.sent || 0;
                  const opened = campaign.metrics?.opened || 0;
                  const clicked = campaign.metrics?.clicked || 0;
                  const replied = campaign.metrics?.replied || 0;

                  return (
                    <tr key={campaign.Id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sent > 0 ? ((opened / sent) * 100).toFixed(1) : 0}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sent > 0 ? ((clicked / sent) * 100).toFixed(1) : 0}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sent > 0 ? ((replied / sent) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;