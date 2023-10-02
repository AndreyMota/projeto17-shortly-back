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

export async function getUrlById(req, res) {
    try {
        const id = req.params.id;
        const result = await db.query(`SELECT * FROM urls WHERE id = $1`, [id]);
        if (result.rowCount < 1) {
            return res.sendStatus(404);
        }
        const final = result.rows[0];
        const yo = {
            id: final.id,
            shortUrl: final.short,
            url: final.url
        }
        res.status(200).send(yo);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getUrlsShort(req, res) {
    try {
        const urlS = req.params.shortUrl;
        const result = await db.query('SELECT * FROM urls WHERE short = $1', [urlS]);
        if (result.rowCount < 1) {
            return res.sendStatus(404);
        }
        const final = result.rows[0];
        const add = await db.query(`
        UPDATE urls
        SET times = times + 1
        WHERE id = $1;
        `, [final.id]);
        res.redirect(final.url);
    } catch (err) {
        res.status(500).send(err.message);
    }
}