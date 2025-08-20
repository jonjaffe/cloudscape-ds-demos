// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { Breadcrumbs, HelpPanelProvider, Notifications } from '../commons';
import { CustomAppLayout } from '../commons/common-components';
import { WeatherContent } from './components/content';
import { WeatherDashboardHeader } from './components/header';

import '@cloudscape-design/global-styles/dark-mode-utils.css';

function WeatherMainInfo() {
  return (
    <div>
      <h3>About Weather Dashboard</h3>
      <p>
        This weather dashboard provides real-time weather information and forecasts using the Open-Meteo API.
      </p>
      <h4>Features:</h4>
      <ul>
        <li>Current weather conditions with detailed metrics</li>
        <li>7-day weather forecast</li>
        <li>24-hour temperature trend chart</li>
        <li>Weather alerts and warnings</li>
        <li>Automatic location detection</li>
      </ul>
      <h4>Data Source:</h4>
      <p>
        Weather data is provided by Open-Meteo, a free and open-source weather API that offers 
        accurate weather forecasts without requiring API keys.
      </p>
    </div>
  );
}

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsContent, setToolsContent] = useState<React.ReactNode>(() => <WeatherMainInfo />);
  const appLayout = useRef<AppLayoutProps.Ref>(null);

  const handleToolsContentChange = (content: React.ReactNode) => {
    setToolsOpen(true);
    setToolsContent(content);
    appLayout.current?.focusToolsClose();
  };

  return (
    <HelpPanelProvider value={handleToolsContentChange}>
      <CustomAppLayout
        ref={appLayout}
        content={
          <SpaceBetween size="m">
            <WeatherDashboardHeader />
            <WeatherContent />
          </SpaceBetween>
        }
        breadcrumbs={
          <Breadcrumbs 
            items={[
              { text: 'Home', href: '#/' },
              { text: 'Weather Dashboard', href: '#/weather-dashboard' }
            ]} 
          />
        }
        navigationHide
        tools={toolsContent}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={<Notifications />}
      />
    </HelpPanelProvider>
  );
}
