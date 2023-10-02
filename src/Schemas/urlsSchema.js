import Joi from "joi";

export const urlSchema = Joi.object({
    url: Joi.string()
        .uri({ scheme: ['http', 'https'] }) // Verifica se é uma URL válida com os esquemas HTTP ou HTTPS
        .required()
});