#!/bin/bash -i

# Change to backend directory
cd backend

# Activate virtual environment
source "$(pyenv root)/versions/currency_alerter_env/bin/activate"

# Run uvicorn
uvicorn main:app --reload
