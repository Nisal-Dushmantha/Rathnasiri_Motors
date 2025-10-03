# Securing Your Environment Variables

This project uses environment variables for configuration. To keep sensitive data secure:

## Setup Instructions

1. Create a `.env` file in the `BACKEND` directory
2. Copy the contents from `.env.example` into your new `.env` file
3. Replace the placeholder values with your actual credentials

## Important Security Notes

- NEVER commit `.env` files to Git
- Keep your API keys, passwords, and tokens confidential
- The `.gitignore` file is configured to exclude `.env` files from Git

## Required Environment Variables

Check `.env.example` for the required variables for this project.
