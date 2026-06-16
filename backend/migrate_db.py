import sqlite3

def migrate():
    conn = sqlite3.connect('servease.db')
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE services ADD COLUMN images JSON DEFAULT '[]'")
        conn.commit()
        print("Successfully added 'images' column to 'services' table.")
    except sqlite3.OperationalError as e:
        print(f"Migration error or already applied: {e}")
    conn.close()

if __name__ == "__main__":
    migrate()
