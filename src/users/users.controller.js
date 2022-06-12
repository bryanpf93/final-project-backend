import { ObjectId } from "mongodb";

// AUTHENTICATION

const DATABASE_NAME = 'final-project';
const COLLECTION_NAME = 'users';


// CONNECT TO DATABASE

const connectToDatabase = (req) => {
    const db = req.app.locals.ddbbClient.db(DATABASE_NAME); // cojo la BBDD
    return db.collection(COLLECTION_NAME); // cojo la coleccion;
}

export const getAllUsersCtrl = async (req, res) => {
    // ir a BBDD y devolver TODOS los estudiantes
    const col = connectToDatabase(req);
    const users = await col.find({}).toArray(); // busco todos los estudiantes y los guardo en un array
    res.json({ data: users }); // devuelvo el resultado del cliente
}

export const getUsertByIdCtrl = async (req, res) => {
    const { id } = req.params;
    const col = connectToDatabase(req);
    if (id.length === 12 || id.length === 24) {
        const o_id = ObjectId(id); // genero un ObjectId de MongoDB, Controlar el pete del ID
        const user = await col.findOne(o_id); // busco el estudiante por su ID
        if (user === null) {
            res.status(404).json({ message: 'User not found', error: true });
        } else {
            res.json({ data: user });
        }
    } else {
        res.status(400).json({ message: 'Invalid ID', error: true });
    }
}

export const updateUserByIdCtrl = async (req, res) => {
    const { id } = req.params;
    const col = connectToDatabase(req);
    if (id.length === 12 || id.length === 24) {
        // genero un ObjectId de MongoDB, Controlar el pete del ID
        const o_id = ObjectId(id)
        const r = await col.updateOne({ _id: o_id }, { $set: req.body }); // busco el estudiante por su ID  
        res.status(200).json({ data: r }) // devuelvo el resultado del cliente
    }
    else {
        res.status(400).json({ message: 'Invalid ID', error: true });
    }
}

export const deleteUserByIdCtrl = async (req, res) => {
    const { id } = req.params;
    const col = connectToDatabase(req);
    if (id.length === 12 || id.length === 24) {
        // genero un ObjectId de MongoDB, Controlar el pete del ID
        const o_id = ObjectId(id)
        const r = await col.deleteOne({ _id: o_id }); // busco el estudiante por su ID  
        res.status(200).json({ data: r }) // devuelvo el resultado del cliente
    }
    else {
        res.status(400).json({ message: 'Invalid ID', error: true });
    }
}

export const putUserCtrl = async (req, res) => {
    const col = connectToDatabase(req);
    const r = await col.replaceOne({ _id: ObjectId(req.params.id) }, req.body);
    res.json(r);
}


export const getUserInfoCtrl = async (req, res) => {
    // llamo al usuario
    try {
        const user = await retrieveUserInfoByEmail(req.email); // ¿Esto sale de una cosa que se llama Middleware?
        res.json(user); // deveulvo la info del usuario
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


export const createUser = async (req) => {
    const users = connectToDatabase(req);
    return await users.insertOne({ ...req.body, status: 'PENDING_VALIDATION' }); // aqui falta validar el body
}

export const getUserByEmail = async (req) => {
    const users = connectToDatabase(req);
    return await users.findOne({ email: req.body.email });
}


// actualiza el usuario cambiando su estaso a success
export const validateUser = async (req, email) => {
    const users = connectToDatabase(req);
    // create a document that sets the plot of the movie
    const updateDoc = {
        $set: {
            status: 'SUCCESS'
        },
    };
    return await users.updateOne({ email }, updateDoc);
}

// devuelve el usuario de BBDDD que esté en estado succes y además coincida
// con el email y con password que me mandan. 
export const retrieveSuccessUserByEmailAndPassword = async (req, email, password) => {
    const users = connectToDatabase(req);
    const query = {
        email,
        password,
        status: 'SUCCESS'
    }
    return await users.findOne(query);
}
