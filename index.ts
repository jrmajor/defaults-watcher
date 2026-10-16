#!/usr/bin/env node

import { run } from '@stricli/core';
import { app } from './src/app.ts';

void run(app, process.argv.slice(2), { process });
