import { getUserByEmail, createUser, validateUser, retrieveSuccessUserByEmailAndPassword } from '../users/users.controller.js';
import { generateValidationToken, encodePassword } from './auth.utils.js'
import { sendValidationEmail } from '../adapters/email.js'
import { jwt_secret } from './auth.secrets.js'
import jwt from 'jsonwebtoken';

const DATABASE_NAME = 'final-project';
const COLLECTION_NAME = 'validate-token';

const token = generateValidationToken();

//  /**
//  * 1. Van a venir los datos de registro en el body. Habrá que validar el body
//  * 2. Generar la entidad usuario y guardarla en BBDD
//  * 3. Generar un token de validación y guardarlo en BBDD asociado al usuario
//  * 4. Enviar un email con la URL de validación
//  */
export const registerCtrl = async (req, res) => {
    try {
        const user = await getUserByEmail(req, res);
        if (user === null) {
            req.body.password = encodePassword(req.body.password);
            await createUser(req); // paso 2
            // paso 3
            await createValidationToken(req);
            // paso 4
            //ojo que el host es el de nuestra aplicación de react
            sendValidationEmail(req.body.email, `http://localhost:3000/validate?token=${token}`)
            res.status(201).json({ message: 'User created', error: false });
        } else {
            // mando un 409(conflict) porque ya existe el usuario en BBDD
            res.status(409).json({ message: 'User is already created', error: 4091 });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error', error: 5001 });
    }
}

/**
 * 1. Obtener el token
 * 2. Validar que existe en BBDD y obtener su usuario asociad
 * 3. Eliminar el token de la BBDD
 * 4. Actualizar el usuario cambiando el estado a SUCCESS
 */
export const validateEmailCtrl = async (req, res) => {
    const valToken = await retrieveValidationToken(req); // paso 2
    if (valToken !== null) {
        // existe token
        await deleteValidationToken(req); // paso 3
        await validateUser(req, valToken.user); // paso 4
        res.status(200).json({ message: 'User email validated', error: false });
    } else {
        res.status(404).json({ message: 'User not found', error: true });
    }
}

/**
 * 1. verificar que existe el usuario con su pass y ademas tiene un estado
 *    SUCCESS
 *  a. encriptar la pass del body
 * 2. Generar un token JWT
 * 3. Devolverlo al usuario
 */
export const loginCtrl = async (req, res) => {
    const { email, password } = req.body;
    // paso 1
    const user = await retrieveSuccessUserByEmailAndPassword(req, email, encodePassword(password));
    if (user !== null) {
        // existe el usuario con esas condiciones
        const token = jwt.sign({ email: user.email, hola: 'bootcamp' }, jwt_secret); // paso 2
        res.status(201).json({ access_token: token }); // paso 3
    } else {
        res.status(404).json({ message: 'User not found', error: true });
    }
}


export const createValidationToken = async (req) => {
    const db = req.app.locals.ddbbClient.db(DATABASE_NAME);
    const tokens = db.collection(COLLECTION_NAME);
    return await tokens.insertOne({ // asociamos el token al usuario en la BBDD
        token,
        user: req.body.email
    });
}

// devuelve el token o null si no existe
export const retrieveValidationToken = async (req) => {
    const db = req.app.locals.ddbbClient.db(DATABASE_NAME);
    const tokens = db.collection(COLLECTION_NAME);
    return await tokens.findOne({ token: req.query.token });
}

// borra el token de la BBDD
export const deleteValidationToken = async (req) => {
    const db = req.app.locals.ddbbClient.db(DATABASE_NAME);
    const tokens = db.collection(COLLECTION_NAME);
    return await tokens.deleteOne({ token: req.query.token });
}
