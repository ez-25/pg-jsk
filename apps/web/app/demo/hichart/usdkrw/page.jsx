'use client';

import { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { useUsdKrwCsvData } from './hooks/useUsdKrwCsvData';

const timeframes = [
  { label: '1년', value: '1Y' },
  { label: '10년', value: '10Y' },
  { label: '100년', value: '100Y' }
];

export default function UsdKrwChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const { data, loading, error } = useUsdKrwCsvData(selectedTimeframe);

  const getChartOptions = (data) => ({
    chart: {
      type: 'line',
      zoomType: 'x',
      style: { fontFamily: 'Arial, sans-serif' }
    },
    title: {
      text: `USD/KRW 환율 차트 (${timeframes.find(t => t.value === selectedTimeframe).label})`,
      style: { fontSize: '20px', fontWeight: 'bold' }
    },
    subtitle: {
      text: 'Source: @data/usd_krw_*.csv',
      style: { fontSize: '12px' }
    },
    xAxis: {
      type: 'datetime',
      title: { text: '날짜/연도', style: { fontSize: '14px' } },
      labels: { format: '{value:%Y-%m-%d}', rotation: -45, align: 'right' },
      gridLineWidth: 1,
      tickmarkPlacement: 'on'
    },
    yAxis: {
      title: { text: 'USD/KRW 환율', style: { fontSize: '14px' } },
      labels: { format: '{value:,.2f}' },
      gridLineWidth: 1
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%Y-%m-%d}<br>환율: {point.y:,.2f}',
      valueDecimals: 2,
      shared: true,
      crosshairs: true
    },
    series: [{
      name: 'USD/KRW',
      data: data,
      color: '#1976d2',
      lineWidth: 2,
      marker: { enabled: data.length < 100, radius: 4 }
    }],
    plotOptions: {
      series: {
        animation: { duration: 1500 },
        states: { hover: { lineWidth: 3 } }
      }
    },
    legend: { enabled: false },
    credits: {
      enabled: true,
      text: 'Data: usd_krw_*.csv',
      style: { fontSize: '10px' }
    },
    responsive: {
      rules: [{
        condition: { maxWidth: 500 },
        chartOptions: {
          chart: { height: 300 },
          subtitle: { text: null },
          navigator: { enabled: false }
        }
      }]
    }
  });

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">Error loading USD/KRW data: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          USD/KRW 환율 히스토리
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          1년, 10년, 100년치 실제 원/달러 환율 데이터
        </Typography>
        <Box mb={3}>
          <ButtonGroup variant="contained" aria-label="timeframe selection">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                variant={selectedTimeframe === timeframe.value ? 'contained' : 'outlined'}
                color="primary"
              >
                {timeframe.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        <Box position="relative" minHeight={400}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" position="absolute" top={0} left={0} right={0} bottom={0}>
              <CircularProgress />
            </Box>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={getChartOptions(data)} />
          )}
        </Box>
      </Paper>
    </Box>
  );
} 