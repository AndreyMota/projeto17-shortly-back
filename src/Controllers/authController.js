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


import { v4 as uuidv4 } from 'uuid'; // Importe o 'v4' da biblioteca 'uuid'

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        // Consultar o banco de dados para verificar se o usuário existe
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            // Usuário não encontrado, retornar status code 404
            return res.status(401).send('E-mail não cadastrado!');
        }

        // Verificar se a senha está correta
        const user = result.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            // Senha incorreta, retornar status code 401
            return res.status(401).send('Senha incorreta! Tente novamente!');
        }

        // Gerar um token compatível com SQL usando UUID v4
        const token = uuidv4();

        // Inserir o token na tabela sessions
        const insertTokenQuery = 'INSERT INTO sessions (token, user_id) VALUES ($1, $2)';
        await db.query(insertTokenQuery, [token, user.id]);

        // Retornar os dados do usuário e o token
        res.status(200).json({
            token: token
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getMe(req, res) {
    const userId = res.locals.userId; // Obtém o ID do usuário autenticado a partir do middleware

    try {
        // Consultar o usuário com base no ID
        const userQuery = 'SELECT * FROM users WHERE id = $1';
        const userResult = await db.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            // Usuário não encontrado, responder com status code 404
            return res.status(404).send('Usuário não encontrado');
        }

        const user = userResult.rows[0];

        // Consultar todas as URLs encurtadas pertencentes ao usuário
        const urlsQuery = 'SELECT id, shortUrl, url, visitCounts FROM urls WHERE userId = $1';
        const urlsResult = await db.query(urlsQuery, [userId]);

        // Calcular a soma da quantidade de visitas de todos os links do usuário
        let visitCount = 0;

        for (const url of urlsResult.rows) {
            // Use o valor do campo "times" de cada URL encurtada
            visitCount += url.visitcounts;
        }

        const formatado = []
        urlsResult.rows.map(x => {
            formatado.push({
                id: x.id,
                shortUrl: x.shorturl,
                url: x.url,
                visitCount: x.visitcounts
            })
        })

        // Montar o objeto de resposta
        const response = {
            id: user.id,
            name: user.name,
            visitCount: visitCount,
            /* shortenedUrls: urlsResult.rows */
            shortenedUrls: formatado
        };

        // Responder com status code 200 e o corpo no formato especificado
        res.status(200).json(response);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function rankUs(req, res) {
    try {
        // Consulta SQL para obter a classificação dos usuários com base no número de visitas de seus links
        const query = `
        SELECT
            users.id,
            users.name,
            COALESCE(COUNT(urls.id), 0) AS linksCount,
            COALESCE(SUM(urls.visitCounts), 0) AS visitCount
        FROM users
        LEFT JOIN urls ON users.id = urls.userId
        GROUP BY users.id
        ORDER BY visitCount DESC
        LIMIT 10
        `;

        const result = await db.query(query);

        // Mapear o resultado da consulta para o formato de resposta especificado
        const ranking = result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            linksCount: row.linkscount,
            visitCount: row.visitcount
        }));

        // Responder com status code 200 e o corpo no formato especificado
        res.status(200).json(ranking);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
