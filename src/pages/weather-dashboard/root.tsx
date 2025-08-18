// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { CustomAppLayout } from '../commons/common-components';
import { App } from './app';

export default function Root() {
  return (
    <CustomAppLayout content={<App />} contentType="cards" breadcrumbs={<></>} navigationHide={true} toolsHide={true} />
  );
}
