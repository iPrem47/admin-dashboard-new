import React from 'react';
import { InvestmentTrend } from './types';

interface InvestmentChartProps {
  data: InvestmentTrend[];
  loading?: boolean;
}

const InvestmentChart: React.FC<InvestmentChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.investment, d.returns, d.profit)));
  const chartHeight = 200;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Investment Trends</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Investment</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Returns</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Profit</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg width="100%" height={chartHeight + 40} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={index}
              x1="0"
              y1={chartHeight * ratio}
              x2="100%"
              y2={chartHeight * ratio}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          {/* Investment line */}
          <path
            d={`M ${data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}% ${chartHeight - (d.investment / maxValue) * chartHeight}`
            ).join(' L ')}`}
            fill="none"
            stroke="url(#investmentGradient)"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* Returns line */}
          <path
            d={`M ${data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}% ${chartHeight - (d.returns / maxValue) * chartHeight}`
            ).join(' L ')}`}
            fill="none"
            stroke="url(#returnsGradient)"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* Profit line */}
          <path
            d={`M ${data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}% ${chartHeight - (d.profit / maxValue) * chartHeight}`
            ).join(' L ')}`}
            fill="none"
            stroke="url(#profitGradient)"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={`${(i / (data.length - 1)) * 100}%`}
                cy={chartHeight - (d.investment / maxValue) * chartHeight}
                r="4"
                fill="url(#investmentGradient)"
                className="drop-shadow-sm"
              />
              <circle
                cx={`${(i / (data.length - 1)) * 100}%`}
                cy={chartHeight - (d.returns / maxValue) * chartHeight}
                r="4"
                fill="url(#returnsGradient)"
                className="drop-shadow-sm"
              />
              <circle
                cx={`${(i / (data.length - 1)) * 100}%`}
                cy={chartHeight - (d.profit / maxValue) * chartHeight}
                r="4"
                fill="url(#profitGradient)"
                className="drop-shadow-sm"
              />
            </g>
          ))}

          {/* Month labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={`${(i / (data.length - 1)) * 100}%`}
              y={chartHeight + 20}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {d.month}
            </text>
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="investmentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="returnsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="profitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default InvestmentChart;