import db from "../Database/databaseConnection.js";
import { nanoid } from "nanoid";

export async function postUrlShorten(req, res) {
    const { url } = req.body;
    const userId = res.locals.userId; // Obter o userId a partir de res.locals.userId
    const times = 0; // Inicialmente, definimos 'times' como 0
    const short = nanoid();

    try {
        // Inserir a URL encurtada na tabela 'urls'
        const insertUrlQuery = 'INSERT INTO urls (url, shortUrl, userId, visitCounts) VALUES ($1, $2, $3, $4) RETURNING id';
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
            shortUrl: final.shorturl,
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
        const result = await db.query('SELECT * FROM urls WHERE shortUrl = $1', [urlS]);
        if (result.rowCount < 1) {
            return res.sendStatus(404);
        }
        const final = result.rows[0];
        const add = await db.query(`
        UPDATE urls
        SET visitCounts = visitCounts + 1
        WHERE id = $1;
        `, [final.id]);
        res.redirect(final.url);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteShort(req, res) {
    const userId = res.locals.userId; // Obtém o ID do usuário autenticado a partir do middleware

    // Obtém o ID da URL encurtada a partir dos parâmetros da rota
    const urlId = parseInt(req.params.id);

    try {
        // Verifica se a URL encurtada existe e pertence ao usuário autenticado
        const urlQuery = 'SELECT * FROM urls WHERE id = $1 AND userId = $2';
        const urlResult = await db.query(urlQuery, [urlId, userId]);

        if (urlResult.rows.length === 0) {
            // URL encurtada não existe ou não pertence ao usuário, responder com status code 401
            return res.status(404).send('URL encurtada não encontrada ou não autorizada');
        }

        // A URL encurtada pertence ao usuário, então exclua-a
        const deleteQuery = 'DELETE FROM urls WHERE id = $1';
        await db.query(deleteQuery, [urlId]);

        // Responda com status code 204 (sem conteúdo)
        res.status(204).send();
    } catch (err) {
        if (err.code === '22P02') {
            // Trate o erro de conversão de tipo se o ID da URL não for um número válido
            res.status(400).send('ID da URL inválido');
        } else {
            // Outros erros internos do servidor
            res.status(500).send(err.message);
        }
    }
}
