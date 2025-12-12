// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { createRoot } from 'react-dom/client';

import '@cloudscape-design/global-styles/index.css';
import { App } from './app';

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
