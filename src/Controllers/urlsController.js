import db from "../Database/databaseConnection.js";
import { nanoid } from "nanoid";

export async function postUrlShorten(req, res) {
    const { url } = req.body;
    const userId = res.locals.userId; // Obter o userId a partir de res.locals.userId
    const times = 0; // Inicialmente, definimos 'times' como 0
    const short = nanoid();

    try {
        // Inserir a URL encurtada na tabela 'urls'
        const insertUrlQuery = 'INSERT INTO urls (url, short, userId, times) VALUES ($1, $2, $3, $4) RETURNING id';
        const result = await db.query(insertUrlQuery, [url, short, userId, times]);

        // Verificar se a inserção foi bem-sucedida e obter o ID gerado
        if (result.rowCount === 1) {
            const newUrlId = result.rows[0].id;
            res.status(201).json({ id: newUrlId, shortUrl: short });
        } else {
            res.status(500).send('Erro ao encurtar a URL');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}
