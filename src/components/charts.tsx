'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartLineTimeProps = {
  categories: string[];
  data1: number[];
  data2: number[];
  className?: string;
  children?: React.ReactNode;
};

export function ChartLineTime({ categories, data1, data2, className = '' }: ChartLineTimeProps) {
  const chartOptions = {
    chart: {
      height: 350,
      dropShadow: {
        enabled: true,
        color: '#000',
        blur: 10,
        opacity: 0.2,
      },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
      enabled: true,
    },
    title: {
      text: 'Valores (R$)',
      align: 'left' as const, // <-- isso resolve o erro
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    markers: {
      size: 1,
    },
    xaxis: {
      categories,
      title: {
        text: 'Mês',
      },
    },
    yaxis: {
      title: {
        text: 'Valores',
      },
      min: 0,
    },
    legend: {
      position: 'top' as const,
    },
  };

  const series = [
    {
      name: 'Valor',
      data: data1,
    },
    {
      name: 'Quantidade',
      data: data2,
    },
  ];

  return (
    <div className={className}>
      <ApexChart type="line" options={chartOptions} series={series} height={500} width="100%" />
    </div>
  );
}
