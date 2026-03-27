import Database from 'better-sqlite3'

// connecet with DB
const db = new Database('./db/data.db')

// sql
function createTables(){
    db.exec(`
        CREATE TABLE IF NOT EXISTS user(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        isAdmin INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    is_completed INTEGER DEFAULT 0 ,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id))`);
}

export{db}
export default createTables;

