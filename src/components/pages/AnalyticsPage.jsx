import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import MetricCard from '@/components/molecules/MetricCard';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { campaignService } from '@/services/api/campaignService';
import { emailThreadService } from '@/services/api/emailThreadService';
import { toast } from 'react-toastify';
const AnalyticsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('7d');
  const [chartType, setChartType] = useState('bar');
  const [exportLoading, setExportLoading] = useState(false);

  // Chart type options
  const chartTypeOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'stackedBar', label: 'Stacked Bar' },
    { value: 'area', label: 'Area Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'radar', label: 'Radar Chart' }
  ];

  // Export format options
  const exportFormats = [
    { value: 'png', label: 'PNG Image' },
    { value: 'svg', label: 'SVG Vector' },
    { value: 'pdf', label: 'PDF Document' },
    { value: 'csv', label: 'CSV Data' }
  ];
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

  // Export functionality
  const exportChart = async (format, chartId) => {
    setExportLoading(true);
    try {
      if (format === 'csv') {
        exportToCSV();
      } else {
        const chart = window.ApexCharts.getChartByID(chartId);
        if (chart) {
          await chart.dataURI({ format }).then(({ imgURI }) => {
            const link = document.createElement('a');
            link.href = imgURI;
            link.download = `analytics-${chartId}-${Date.now()}.${format}`;
            link.click();
          });
        }
      }
      toast.success(`Chart exported successfully as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error('Failed to export chart');
    } finally {
      setExportLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvData = [
      ['Campaign', 'Sent', 'Opened', 'Clicked', 'Replied', 'Bounced', 'Open Rate %', 'Click Rate %', 'Reply Rate %'],
      ...campaigns.map(campaign => [
        campaign.name,
        campaign.metrics?.sent || 0,
        campaign.metrics?.opened || 0,
        campaign.metrics?.clicked || 0,
        campaign.metrics?.replied || 0,
        campaign.metrics?.bounced || 0,
        campaign.metrics?.sent > 0 ? ((campaign.metrics?.opened || 0) / campaign.metrics.sent * 100).toFixed(1) : 0,
        campaign.metrics?.sent > 0 ? ((campaign.metrics?.clicked || 0) / campaign.metrics.sent * 100).toFixed(1) : 0,
        campaign.metrics?.sent > 0 ? ((campaign.metrics?.replied || 0) / campaign.metrics.sent * 100).toFixed(1) : 0
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-data-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
// Dynamic chart configuration based on selected type
  const getChartConfig = (type) => {
    const baseConfig = {
      chart: {
        id: 'campaign-performance',
        height: 350,
        toolbar: { 
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          },
          export: {
            csv: {
              filename: `analytics-${Date.now()}`,
              columnDelimiter: ',',
              headerCategory: 'Campaign',
              headerValue: 'Value'
            },
            svg: {
              filename: `analytics-${Date.now()}`
            },
            png: {
              filename: `analytics-${Date.now()}`
            }
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      dataLabels: { enabled: false },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        floating: false,
        offsetY: -10
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: { height: 300 },
          legend: { position: 'bottom' }
        }
      }]
    };

    switch (type) {
      case 'stackedBar':
        return {
          ...baseConfig,
          chart: { ...baseConfig.chart, type: 'bar', stacked: true },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            }
          },
          xaxis: {
            categories: campaigns.slice(0, 8).map(c => c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name),
            labels: { rotate: -45 }
          },
          yaxis: { title: { text: 'Number of Emails' } }
        };

      case 'area':
        return {
          ...baseConfig,
          chart: { ...baseConfig.chart, type: 'area' },
          stroke: { curve: 'smooth', width: 3 },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.3,
              stops: [0, 90, 100]
            }
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
          },
          yaxis: { title: { text: 'Email Count' } }
        };

      case 'pie':
        return {
          ...baseConfig,
          chart: { ...baseConfig.chart, type: 'pie' },
          labels: ['Sent', 'Opened', 'Clicked', 'Replied'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: { width: 300 },
              legend: { position: 'bottom' }
            }
          }]
        };

      case 'radar':
        return {
          ...baseConfig,
          chart: { ...baseConfig.chart, type: 'radar' },
          xaxis: {
            categories: ['Open Rate', 'Click Rate', 'Reply Rate', 'Conversion Rate', 'Engagement Score']
          },
          yaxis: { show: false },
          markers: { size: 6 }
        };

      default: // bar
        return {
          ...baseConfig,
          chart: { ...baseConfig.chart, type: 'bar' },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded',
              borderRadius: 4
            }
          },
          xaxis: {
            categories: campaigns.slice(0, 8).map(c => c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name),
            labels: { rotate: -45 }
          },
          yaxis: { title: { text: 'Number of Emails' } },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + " emails"
              }
            }
          }
        };
    }
  };

  // Dynamic series data based on chart type
  const getSeriesData = (type) => {
    switch (type) {
      case 'pie':
        return [totalSent, totalOpened, totalClicked, totalReplied];
      
      case 'radar':
        return [{
          name: 'Performance Metrics',
          data: [
            parseFloat(openRate),
            parseFloat(clickRate),
            parseFloat(replyRate),
            parseFloat(clickRate) * 0.8, // Mock conversion rate
            (parseFloat(openRate) + parseFloat(clickRate) + parseFloat(replyRate)) / 3 // Mock engagement score
          ]
        }];
      
      case 'area':
        return [
          {
            name: 'Sent',
            data: [120, 145, 167, 189, 210, 245, 267, 290]
          },
          {
            name: 'Opened',
            data: [65, 78, 89, 102, 115, 134, 142, 158]
          },
          {
            name: 'Clicked',
            data: [20, 25, 28, 32, 35, 40, 45, 48]
          },
          {
            name: 'Replied',
            data: [12, 15, 18, 22, 25, 28, 31, 34]
          }
        ];

      default: // bar and stackedBar
        return [
          {
            name: 'Sent',
            data: campaigns.slice(0, 8).map(c => c.metrics?.sent || 0)
          },
          {
            name: 'Opened',
            data: campaigns.slice(0, 8).map(c => c.metrics?.opened || 0)
          },
          {
            name: 'Clicked',
            data: campaigns.slice(0, 8).map(c => c.metrics?.clicked || 0)
          },
          {
            name: 'Replied',
            data: campaigns.slice(0, 8).map(c => c.metrics?.replied || 0)
          }
        ];
    }
  };

  const campaignPerformanceData = {
    options: getChartConfig(chartType),
    series: getSeriesData(chartType)
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
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Monitor your email campaign performance with detailed insights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
              { value: '1y', label: 'Last year' }
            ]}
            className="min-w-[140px]"
          />
          
          <Select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            options={chartTypeOptions}
            className="min-w-[140px]"
          />
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon="Download"
              onClick={() => exportChart('png', 'campaign-performance')}
              disabled={exportLoading}
              className="min-w-[100px]"
            >
              {exportLoading ? 'Exporting...' : 'Export'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon="FileText"
              onClick={() => exportChart('csv', 'campaign-performance')}
              disabled={exportLoading}
            >
              CSV
            </Button>
          </div>
        </div>
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

{/* Advanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Main Campaign Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2"
        >
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Campaign Performance Analysis
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {chartTypeOptions.find(option => option.value === chartType)?.label} view of your campaign metrics
                </p>
              </div>
              
              <div className="flex gap-2 mt-4 sm:mt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="BarChart3"
                  onClick={() => setChartType('bar')}
                  className={chartType === 'bar' ? 'bg-primary-50 text-primary-600' : ''}
                >
                  Bar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="AreaChart"
                  onClick={() => setChartType('area')}
                  className={chartType === 'area' ? 'bg-primary-50 text-primary-600' : ''}
                >
                  Area
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="PieChart"
                  onClick={() => setChartType('pie')}
                  className={chartType === 'pie' ? 'bg-primary-50 text-primary-600' : ''}
                >
                  Pie
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Radar"
                  onClick={() => setChartType('radar')}
                  className={chartType === 'radar' ? 'bg-primary-50 text-primary-600' : ''}
                >
                  Radar
                </Button>
              </div>
            </div>
            
            <Chart
              options={campaignPerformanceData.options}
              series={campaignPerformanceData.series}
              type={chartType === 'stackedBar' ? 'bar' : chartType}
              height={400}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Conversion Funnel
              </h3>
              <Button
                variant="ghost"
                size="sm"
                icon="Download"
                onClick={() => exportChart('png', 'conversion-funnel')}
                disabled={exportLoading}
              >
                <ApperIcon name="Download" size={16} />
              </Button>
            </div>
            <Chart
              options={{
                ...conversionFunnelData.options,
                chart: { ...conversionFunnelData.options.chart, id: 'conversion-funnel' }
              }}
              series={conversionFunnelData.series}
              type="donut"
              height={350}
            />
          </Card>
        </motion.div>

        {/* Performance Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Trends
              </h3>
              <Button
                variant="ghost"
                size="sm"
                icon="Download"
                onClick={() => exportChart('png', 'performance-trends')}
                disabled={exportLoading}
              >
                <ApperIcon name="Download" size={16} />
              </Button>
            </div>
            <Chart
              options={{
                ...timeSeriesData.options,
                chart: { ...timeSeriesData.options.chart, id: 'performance-trends' }
              }}
              series={timeSeriesData.series}
              type="line"
              height={350}
            />
          </Card>
        </motion.div>
      </div>

{/* Export Controls Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Export Analytics Data
              </h3>
              <p className="text-sm text-gray-600">
                Download your analytics data in various formats for further analysis
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              {exportFormats.map((format) => (
                <Button
                  key={format.value}
                  variant="outline"
                  size="sm"
                  icon={format.value === 'csv' ? 'FileText' : format.value === 'pdf' ? 'FileText' : 'Download'}
                  onClick={() => exportChart(format.value, 'campaign-performance')}
                  disabled={exportLoading}
                  className="min-w-[100px]"
                >
                  {format.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
{/* Enhanced Campaign Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Detailed Campaign Breakdown
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive performance metrics for all campaigns
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              icon="Download"
              onClick={() => exportChart('csv', 'campaign-breakdown')}
              disabled={exportLoading}
            >
              Export Table
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bounce Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.slice(0, 10).map((campaign) => {
                  const sent = campaign.metrics?.sent || 0;
                  const opened = campaign.metrics?.opened || 0;
                  const clicked = campaign.metrics?.clicked || 0;
                  const replied = campaign.metrics?.replied || 0;
                  const bounced = campaign.metrics?.bounced || 0;
                  
                  const openRate = sent > 0 ? ((opened / sent) * 100).toFixed(1) : 0;
                  const clickRate = sent > 0 ? ((clicked / sent) * 100).toFixed(1) : 0;
                  const replyRate = sent > 0 ? ((replied / sent) * 100).toFixed(1) : 0;
                  const bounceRate = sent > 0 ? ((bounced / sent) * 100).toFixed(1) : 0;
                  const roi = (Math.random() * 300 + 50).toFixed(0); // Mock ROI

                  return (
                    <tr key={campaign.Id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {campaign.type || 'Email Campaign'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          campaign.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : campaign.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status || 'draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className={`${parseFloat(openRate) >= 25 ? 'text-green-600' : parseFloat(openRate) >= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {openRate}%
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${parseFloat(openRate) >= 25 ? 'bg-green-500' : parseFloat(openRate) >= 15 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(parseFloat(openRate) * 2, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className={`${parseFloat(clickRate) >= 10 ? 'text-green-600' : parseFloat(clickRate) >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {clickRate}%
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${parseFloat(clickRate) >= 10 ? 'bg-green-500' : parseFloat(clickRate) >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(parseFloat(clickRate) * 4, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`${parseFloat(replyRate) >= 5 ? 'text-green-600' : parseFloat(replyRate) >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {replyRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`${parseFloat(bounceRate) <= 5 ? 'text-green-600' : parseFloat(bounceRate) <= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {bounceRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="text-green-600 font-medium">
                          {roi}%
                        </span>
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