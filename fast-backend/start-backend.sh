#!/bin/bash
. "env/bin/activate"
uvicorn main:app --host 0.0.0.0 --port 8009
