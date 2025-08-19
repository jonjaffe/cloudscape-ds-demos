// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WeatherDashboard from './weather-dashboard';

export default function WeatherDashboardDemo() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WeatherDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
