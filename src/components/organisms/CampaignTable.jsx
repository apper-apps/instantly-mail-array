import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { format } from 'date-fns';

const CampaignTable = ({ campaigns, onEdit, onDelete, onDuplicate, onToggleStatus }) => {
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'paused': return 'paused';
      case 'draft': return 'draft';
      case 'completed': return 'sent';
      default: return 'default';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
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
                Leads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opened
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Replied
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
            className="bg-white divide-y divide-gray-200"
          >
            {campaigns.map((campaign) => (
              <motion.tr
                key={campaign.Id}
                variants={item}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/campaigns/${campaign.Id}/edit`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-500">
                      {campaign.emailSequence?.length || 0} emails
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {campaign.leads?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {campaign.metrics?.sent || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {campaign.metrics?.opened || 0}
                    <span className="text-gray-500 ml-1">
                      ({campaign.metrics?.sent > 0 ? Math.round(((campaign.metrics?.opened || 0) / campaign.metrics.sent) * 100) : 0}%)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {campaign.metrics?.replied || 0}
                    <span className="text-gray-500 ml-1">
                      ({campaign.metrics?.sent > 0 ? Math.round(((campaign.metrics?.replied || 0) / campaign.metrics.sent) * 100) : 0}%)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleStatus(campaign.Id)}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      title={campaign.status === 'active' ? 'Pause campaign' : 'Start campaign'}
                    >
                      <ApperIcon name={campaign.status === 'active' ? 'Pause' : 'Play'} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(campaign.Id)}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      title="Edit campaign"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicate(campaign.Id)}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      title="Duplicate campaign"
                    >
                      <ApperIcon name="Copy" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(campaign.Id)}
                      className="text-gray-400 hover:text-error-600 transition-colors"
                      title="Delete campaign"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignTable;