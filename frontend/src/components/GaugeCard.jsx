import React from "react";
import { 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from "recharts";

const GaugeCard = ({
  gauge = {},
  colorInfo = {},
  timeFrameLabel = "",
  highlightNegative = false,
}) => {
  const { name = "Metric", value = 0, max = 100 } = gauge;
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  const safeMax = Math.max(Number(max) || 100, 100, absValue);
  
  // Force a tiny visual slice even if value is 0 so the color shows up
  const chartValue = absValue === 0 ? safeMax * 0.05 : absValue;
  const percentage = Math.min((absValue / safeMax) * 100, 100);

  const colorMap = {
    Income: "#10b981",  // Emerald Green
    Spent: "#f97316",   // Orange
    Savings: "#06b6d4"  // Cyan
  };

  const activeColor = isNegative ? "#ef4444" : (colorMap[name] || "#6366f1");

  const chartData = [{
    ...gauge,
    value: chartValue,
    fill: activeColor
  }];

  return (
    <div className="bg-white rounded-xl p-5 -mx-3 lg:-mx-0 md:-mx-5 shadow-sm flex flex-col items-center border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {name}
      </h3>
      <div className="w-full h-48">
        <ResponsiveContainer>
          <RadialBarChart
            data={chartData}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
          >
            <PolarAngleAxis
              type="number"
              domain={[0, safeMax]}
              angleAxisId={0}
              tick={false}
              allowDataOverflow
            />

            <RadialBar
              minAngle={15}
              background={{ fill: '#f3f4f6' }}
              dataKey="value"
              cornerRadius="50%"
              fill={activeColor}
            />

            <text 
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="text-2xl font-bold text-gray-800"
            >
              {isNegative ? '-' : ''}${Math.round(absValue).toLocaleString()}
            </text>
            <text 
              x="50%" 
              y="65%" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="text-sm text-gray-500"
            >
              {Math.round(percentage)}%
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-3">
        {isNegative && highlightNegative && (
          <p className="text-sm text-red-600 font-semibold mb-1">
            Negative savings
          </p>
        )}
        <p className="text-sm text-gray-500">
          {timeFrameLabel} data
        </p>
      </div>
    </div>
  );
};

export default GaugeCard;