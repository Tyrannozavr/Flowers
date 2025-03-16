1.
```
python -m venv .venv
```
2. 
windows
```
.venv\Scripts\activate
```

или

linux
```
source .venv/bin/activate
```
3
```
    pip install -r requirements.txt
```
4
```
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload  
```

### FOR MIGRATIONS
```bash 
alembic init migrations
```
```bash
alembic revision --autogenerate
```
```bash
alembic upgrade head
```
