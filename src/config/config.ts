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
}

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
