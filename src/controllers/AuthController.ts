import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import config from '../config';
import basicAuth, { BasicAuthResult } from 'basic-auth';
import { UnauthorizedError } from '../exceptions/unauthorizedError';
import { tokenSchema, refreshTokenSchema } from '../schemas/yup.token'
import Oauth from '../models/oauth.model'

class AuthController {

    static createToken = async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            username: req.body.username,
            client_id: req.body.client_id,
            scope: req.body.doc.scope
        }

        // Generate and sign a JWT that is valid for one hour.
        const access_token = sign(data, config.jwt.secret!, {
            expiresIn: config.jwt.token_ttl,
            notBefore: '0', // Cannot use before now, can be configured to be deferred.
            algorithm: 'HS256',
            audience: config.jwt.audience,
            issuer: config.jwt.issuer
        });
        console.log(access_token);
        const token_reponse = {
            token_type: 'Bearer',
            access_token: access_token,
            expires_in: config.jwt.token_ttl, //value in seconds
            // refresh_token: randtoken.uid(256),
            // refresh_token_expires_in: Number(process.env.RTEXT), //value in seconds
            // refresh_token_expires_in_date: Math.floor(Date.now() / 1000) + Number(process.env.RTEXT),
        }

        res.type('json').send(token_reponse);
    };

    static getHeaderData = (req: Request, res: Response, next: NextFunction) => {
        const { client_id, client_secret } = req.body;
        const { authorization } = req.headers;

        if (typeof authorization === 'string') {
            if (typeof client_id === 'undefined' || client_secret === 'undefined') {
                const client: BasicAuthResult | undefined = basicAuth.parse(authorization);
                req.body.client_id = client?.name;
                req.body.client_secret = client?.pass;
            }
        }

        return next();
    }

    static validationRequestData = async (req: Request, res: Response, next: NextFunction) => {

        let doc = null;
        const { grant_type } = req.body;

        if (grant_type === 'password') {

            try {
                doc = await Oauth.check_credentials_exist(req.body);
                if (doc === null) throw new UnauthorizedError('e_4005', 'Informacion de autenticación erronea', 'Datos de acceso incorrectos');
                req.body.doc = doc;


                if (doc.scope.includes('read')) return next();


                throw new UnauthorizedError('e_4007', 'No autorizado', 'No cuenta con los permisos necesarios');

            } catch (err: object | any) {
                const code = err.code || 'e_4004';
                const message = !err.code ? 'Informacion de autenticación erronea' : err.message;
                const additionalInfo = !err.code ? err.message : err.additionalInfo;

                throw new UnauthorizedError(code, message, additionalInfo);
            }

        } else if (grant_type === 'refresh_token') {
            throw new UnauthorizedError('e_4008', 'No autorizado', "Por implementarse");
        }
        return next();
    }


    static validationRequest = async (req: Request, res: Response, next: NextFunction) => {
        const { grant_type } = req.body;

        if (typeof grant_type === 'undefined') throw new UnauthorizedError('e_4002', 'Informacion de autenticación incompleta o erronea', 'grant_type es requerido.');

        try {
            if (grant_type === 'password') {
                await tokenSchema.validate(req.body);
                return next();
            } else if (grant_type === 'refresh_token') {
                await refreshTokenSchema.validate(req.body);
                return next();
            }
        } catch (err: object | any) {
            throw new UnauthorizedError('e_4001', 'Informacion de autenticación incompleta o erronea', err.errors);
        }

        throw new UnauthorizedError('e_4003', 'Informacion de autenticación incompleta o erronea', `grant_type: ${grant_type} no soportado`);
    }
}

export default AuthController;
