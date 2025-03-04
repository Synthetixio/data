#!/bin/bash
echo "Environment variables:"
env | grep PG_
pip install -r requirements.txt
/app/run_app.sh mage start Synthetix

