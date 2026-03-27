import createTables, { db } from "./db/sql.js";
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { authMiddleware } from './auth.js';
import bcrypt from 'bcrypt';


const app = express();
const PORT = 3007;

app.use(express.json())
app.use(cors())




// call function to create tables if not exist
createTables();

// route para mostrar as tasks
app.get('/show', authMiddleware, (req, res) => {
    try {
        const userID = req.user.id;

        const stmt = db.prepare(`
        SELECT * FROM  tasks WHERE user_id = ?`);
        const tasks = stmt.all(userID)
        res.json(tasks)
    }catch(error) {
        console.error(error);
        res.status(500).json({ error: "Error loadin tasks"})
    }
})
// register user route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = db.prepare(`INSERT INTO user(username, password) VALUES(?,?)`)
        sql.run(username, hashedPassword);
        res.status(201).json({ message: 'Registered successfully!' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: 'Erro to registering user' })
    }
})
// login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = db.prepare(`SELECT * FROM user WHERE username = ?`).get(username);

        if (!user) {
            return res.status(404).json({ error: 'invalid username or password!' })
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'invalid username or password' })
        }
        // token do frontend nao e middleware
        const token = jwt.sign(
            { id: user.id, username: user.username },
            "batatinhaFrita123",
            { expiresIn: "1h" }
        );
        // manda o token e o username para salvar no frontend
        res.json({
            token: token,
            user: {
                id: user.id,
                username: user.username
            }
        })

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Error during login')
    }
})

// add task
app.post('/addTask', authMiddleware, (req, res) => {
    const { title } = req.body;
    const userID = req.user.id;

    const stmt = db.prepare(`
        INSERT INTO tasks(user_id, title) VALUES(?,?)
        `);
    stmt.run(userID, title)
    res.json({ message: 'Task added succesfully!' })
})

// checkbox to check if is completed or not
app.patch('/tasks/:id', authMiddleware, (req, res) => {
    const { id } = req.params
    const { is_completed } = req.body

    // validation
    if (typeof is_completed === 'undefined') {
        return res.status(400).json({ error: 'is_completed is mandatory' })
    }
    //chega o dono da task
    const userID = req.user.id;
    const result = db.prepare(`
    UPDATE tasks 
    SET is_completed = ?
    WHERE id = ? AND user_id = ?
  `).run(is_completed ? 1 : 0, id, userID);

    //valida se e dono da task
    if (result.changes === 0) {
        return res.status(403).json({ error: 'not allowed!' })
    }

    res.json({ message: 'is_completed updated!' })
})

// delete task
app.delete('/delete/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const userID = req.user.id;

    const result = db.prepare(`DELETE from tasks WHERE id = ? AND user_id = ?`).run(id, userID)

    if (result.changes === 0) {
        return res.status(403).json({ error: 'not allowed or task not found' })
    }

    res.json({ message: 'Task deleted successfully!' })
})

app.listen(PORT, () => {
    console.log('Running at http://localhost:3007');
})

