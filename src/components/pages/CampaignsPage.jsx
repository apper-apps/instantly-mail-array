import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import MetricCard from '@/components/molecules/MetricCard';
import SearchBar from '@/components/molecules/SearchBar';
import CampaignTable from '@/components/organisms/CampaignTable';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { campaignService } from '@/services/api/campaignService';

const CampaignsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const campaign = campaigns.find(c => c.Id === id);
      const newStatus = campaign.status === 'active' ? 'paused' : 'active';
      
      await campaignService.update(id, { status: newStatus });
      setCampaigns(campaigns.map(c => 
        c.Id === id ? { ...c, status: newStatus } : c
      ));
      
      toast.success(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (err) {
      toast.error('Failed to update campaign status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      await campaignService.delete(id);
      setCampaigns(campaigns.filter(c => c.Id !== id));
      toast.success('Campaign deleted successfully');
    } catch (err) {
      toast.error('Failed to delete campaign');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const campaign = campaigns.find(c => c.Id === id);
      const duplicatedCampaign = await campaignService.create({
        ...campaign,
        name: `${campaign.name} (Copy)`,
        status: 'draft'
      });
      setCampaigns([duplicatedCampaign, ...campaigns]);
      toast.success('Campaign duplicated successfully');
    } catch (err) {
      toast.error('Failed to duplicate campaign');
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalSent = campaigns.reduce((sum, c) => sum + (c.metrics?.sent || 0), 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + (c.metrics?.opened || 0), 0);
  const totalReplied = campaigns.reduce((sum, c) => sum + (c.metrics?.replied || 0), 0);
  const openRate = totalSent > 0 ? (totalOpened / totalSent * 100).toFixed(1) : 0;
  const replyRate = totalSent > 0 ? (totalReplied / totalSent * 100).toFixed(1) : 0;

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
          title="Failed to load campaigns"
          message={error}
          onRetry={loadCampaigns}
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
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">Manage your email outreach campaigns</p>
        </div>
        <Button
          onClick={() => navigate('/campaigns/new')}
          icon="Plus"
          className="shadow-lg"
        >
          New Campaign
        </Button>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Campaigns"
          value={totalCampaigns}
          icon="Mail"
          gradient
        />
        <MetricCard
          title="Active Campaigns"
          value={activeCampaigns}
          icon="Play"
          gradient
        />
        <MetricCard
          title="Open Rate"
          value={`${openRate}%`}
          change={`${totalOpened} opens`}
          changeType="positive"
          icon="Eye"
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
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campaigns..."
            className="w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">
          {filteredCampaigns.length} of {totalCampaigns} campaigns
        </div>
      </motion.div>

      {/* Campaigns Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredCampaigns.length === 0 ? (
          <Empty
            title="No campaigns found"
            description={searchTerm || statusFilter !== 'all' 
              ? "No campaigns match your search criteria. Try adjusting your filters."
              : "Create your first campaign to start sending emails."
            }
            icon="Mail"
            actionText="Create Campaign"
            onAction={() => navigate('/campaigns/new')}
          />
        ) : (
          <CampaignTable
            campaigns={filteredCampaigns}
            onEdit={(id) => navigate(`/campaigns/${id}/edit`)}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </motion.div>
    </div>
  );
};

export default CampaignsPage;