/**
 * Configuration Manager
 * Handles environment-specific settings for the test framework.
 */

import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Defines the structure for the environment configuration.
 */
export interface IConfig {
    // Environment settings
    ENV: 'development' | 'staging' | 'production' | 'local';
    BASE_URL: string;
    HEADLESS: boolean;
    SLOW_MO: number;
    TIMEOUT: number;

    // Browser settings
    BROWSER: 'chromium' | 'firefox' | 'webkit';
    VIEWPORT_WIDTH: number;
    VIEWPORT_HEIGHT: number;

    // Reporting settings
    ALLURE_RESULTS_DIR: string;
    SCREENSHOT_ON_FAIL: boolean;

    // Database settings (PostgreSQL)
    DB_CONNECTION_STRING: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_SSL: boolean;
    DB_POOL_MAX: number;
    DB_QUERY_TIMEOUT: number;

    // Email notification settings
    EMAIL_NOTIFICATION: boolean;
    EMAIL_SEND_ON: 'always' | 'failure' | 'success';
    EMAIL_DRY_RUN: boolean;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_SECURE: boolean;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    EMAIL_FROM: string;
    EMAIL_TO: string[];
    EMAIL_CC: string[];
    EMAIL_BCC: string[];
    EMAIL_SUBJECT: string;
    EMAIL_TEMPLATE_PATH: string;
    EMAIL_PROJECT_NAME: string;
    EMAIL_ATTACH_REPORT: boolean;
    EMAIL_MAX_ATTACHMENT_MB: number;
}

/** Splits a comma/semicolon separated list of email addresses. */
const parseList = (value?: string): string[] =>
    (value || '').split(/[,;]/).map(item => item.trim()).filter(Boolean);

/**
 * Retrieves the current environment configuration.
 * @returns {IConfig} The configuration object.
 */
export const getConfig = (): IConfig => {
    const env = (process.env.NODE_ENV as IConfig['ENV']) || 'local';

    // Base configuration
    const baseConfig: Partial<IConfig> = {
        ENV: env,
        HEADLESS: process.env.HEADLESS === 'false' ? false : false,
        SLOW_MO: parseInt(process.env.SLOW_MO || '0', 10),
        TIMEOUT: parseInt(process.env.TIMEOUT || '30000', 10),
        BROWSER: (process.env.BROWSER as IConfig['BROWSER']) || 'chromium',
        VIEWPORT_WIDTH: parseInt(process.env.VIEWPORT_WIDTH || '1920', 10),
        VIEWPORT_HEIGHT: parseInt(process.env.VIEWPORT_HEIGHT || '1080', 10),
        ALLURE_RESULTS_DIR: process.env.ALLURE_RESULTS_DIR || 'allure-results',
        SCREENSHOT_ON_FAIL: process.env.SCREENSHOT_ON_FAIL === 'true' ? true : false,
        DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || '',
        DB_HOST: process.env.DB_HOST || 'localhost',
        DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
        DB_NAME: process.env.DB_NAME || '',
        DB_USER: process.env.DB_USER || '',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        DB_SSL: process.env.DB_SSL === 'true',
        DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX || '5', 10),
        DB_QUERY_TIMEOUT: parseInt(process.env.DB_QUERY_TIMEOUT || '30000', 10),
        EMAIL_NOTIFICATION: process.env.EMAIL_NOTIFICATION === 'true',
        EMAIL_SEND_ON: (process.env.EMAIL_SEND_ON as IConfig['EMAIL_SEND_ON']) || 'always',
        EMAIL_DRY_RUN: process.env.EMAIL_DRY_RUN === 'true',
        SMTP_HOST: process.env.SMTP_HOST || '',
        SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
        SMTP_SECURE: process.env.SMTP_SECURE === 'true',
        SMTP_USER: process.env.SMTP_USER || '',
        SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
        EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_USER || '',
        EMAIL_TO: parseList(process.env.EMAIL_TO),
        EMAIL_CC: parseList(process.env.EMAIL_CC),
        EMAIL_BCC: parseList(process.env.EMAIL_BCC),
        EMAIL_SUBJECT: process.env.EMAIL_SUBJECT || '[{{status}}] {{projectName}} - {{passed}}/{{total}} passed ({{env}})',
        EMAIL_TEMPLATE_PATH: process.env.EMAIL_TEMPLATE_PATH || 'email-templates/report-email.html',
        EMAIL_PROJECT_NAME: process.env.EMAIL_PROJECT_NAME || 'Playwright Automation',
        EMAIL_ATTACH_REPORT: process.env.EMAIL_ATTACH_REPORT !== 'false',
        EMAIL_MAX_ATTACHMENT_MB: parseFloat(process.env.EMAIL_MAX_ATTACHMENT_MB || '20'),
    };

    // Environment-specific overrides
    switch (env) {
        case 'production':
            return {
                ...baseConfig,
                BASE_URL: process.env.PROD_BASE_URL || 'https://prod.example.com',
                HEADLESS: true,
                SCREENSHOT_ON_FAIL: false, // Typically disabled in production CI runs for speed
            } as IConfig;
        case 'staging':
            return {
                ...baseConfig,
                BASE_URL: process.env.STAGING_BASE_URL || 'https://staging.example.com',
                HEADLESS: true,
            } as IConfig;
        case 'development':
            return {
                ...baseConfig,
                BASE_URL: process.env.DEV_BASE_URL || 'http://localhost:5173',
                HEADLESS: false, // Easier for local development
            } as IConfig;
        case 'local':
        default:
            return {
                ...baseConfig,
                BASE_URL: process.env.LOCAL_BASE_URL || 'http://localhost:5173',
                HEADLESS: false,
                SLOW_MO: parseInt(process.env.SLOW_MO || '50', 10), // Allow visual debugging speed to be configured
            } as IConfig;
    }
};

export const config = getConfig();
export default config;
