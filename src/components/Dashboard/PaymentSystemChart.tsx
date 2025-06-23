import React from 'react';
import { PaymentSystemData } from './types';

interface PaymentSystemChartProps {
  data: PaymentSystemData[];
  loading?: boolean;
}

const PaymentSystemChart: React.FC<PaymentSystemChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const radius = 80;
  const centerX = 120;
  const centerY = 120;

  const createArcPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number = 0) => {
    const start = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const end = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    if (innerRadius === 0) {
      return [
        "M", centerX, centerY,
        "L", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");
    } else {
      const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle);
      const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle);
      
      return [
        "M", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "L", innerEnd.x, innerEnd.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        "Z"
      ].join(" ");
    }
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment System Distribution</h3>
      
      <div className="flex items-center justify-between">
        <div className="relative">
          <svg width="240" height="240" className="drop-shadow-sm">
            {data.map((item, index) => {
              const angle = (item.value / total) * 360;
              const path = createArcPath(currentAngle, currentAngle + angle, radius, 30);
              const result = (
                <g key={index}>
                  <path
                    d={path}
                    fill={item.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                </g>
              );
              currentAngle += angle;
              return result;
            })}
            
            {/* Center circle with total */}
            <circle
              cx={centerX}
              cy={centerY}
              r="25"
              fill="white"
              className="drop-shadow-sm"
            />
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              className="text-sm font-semibold fill-gray-900"
            >
              {total.toLocaleString()}
            </text>
            <text
              x={centerX}
              y={centerY + 10}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              Total
            </text>
          </svg>
        </div>

        <div className="space-y-4 flex-1 ml-8">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentSystemChart;