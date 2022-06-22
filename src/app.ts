#!/usr/bin/env node

import RequestProvider from './providers/RequestProvider';
import CommandLineProvider from './providers/CommandLineProvider';
import ConvertLogService from './services/ConvertLogService';
import * as process from 'process';

const convertLogService = new ConvertLogService(
  RequestProvider,
  CommandLineProvider,
);

convertLogService.convert().then(() => {
  console.log('Conversion finished');
  process.kill(process.pid, 'SIGTERM');
});
