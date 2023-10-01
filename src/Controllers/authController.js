import db from "../Database/databaseConnection.js";
import bcrypt from "bcrypt";

export async function getUsers(req, res) {
    try {
        const query = `
        SELECT * FROM users`;
        const result = await db.query(query);
        res.send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
    
}

export async function postSignUp(req, res) {
    const { name, email, password } = req.body;
    try {
        const tem = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (tem.rowCount > 0) {
            return res.status(409).send('Email já cadastrado!');
        }
        const passHash = await bcrypt.hash(password, 4);
        const result = await db.query(`
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        `, [name, email, passHash]);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });

    } catch (err) {
        res.status(500).send(err.message);
    }
}