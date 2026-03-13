# backend/wait_for_db.py
import time
import psycopg2
import os

db_host = os.getenv("DB_HOST", "db")

while True:
    try:
        conn = psycopg2.connect(
            dbname="hrms",
            user="postgres",
            password="postgres",
            host=db_host,
            port="5432",
        )
        conn.close()
        print("Database ready!")
        break
    except psycopg2.OperationalError:
        print("Waiting for database...")
        time.sleep(2)