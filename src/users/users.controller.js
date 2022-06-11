import { ObjectId } from "mongodb";

// AUTHENTICATION

const DATABASE_NAME = 'final-project';
const COLLECTION_NAME = 'users';


// GET ALL

export const getAllUsersCtrl = async (req, res) => {
    // ir a BBDD y devolver TODOS los estudiantes
    const db = req.app.locals.ddbbClient.db('final-project'); // cojo la BBDD
    const col = db.collection('users'); // cojo la coleccion
    const users = await col.find({}).toArray(); // busco todos los estudiantes y los guardo en un array
    res.json(users); // devuelvo el resultado del cliente
}

export const createUserCtrl = async (req, res) => {
    const db = req.app.locals.ddbbClient.db('final-project'); // cojo la BBDD
    const col = db.collection('users'); // cojo la coleccion
    const r = await col.insertOne(req.body); // aqui falta validar el body
    res.json({ id: r.insertedId }); // devuelvo el resultado del cliente
}

export const getUsertByIdCtrl = async (req, res) => {
    const { id } = req.params;
    const db = req.app.locals.ddbbClient.db('final-project'); // cojo la BBDD
    const col = db.collection('users'); // cojo la coleccion
    if (id.length === 12 || id.length === 24) {
        const o_id = ObjectId(id); // genero un ObjectId de MongoDB, Controlar el pete del ID
        const user = await col.findOne(o_id); // busco el estudiante por su ID
        if (user === null) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(user);
        }
    } else {
        res.status(400).json({ error: 'Invalid ID' });
    }
}

export const updateUserByIdCtrl = async (req, res) => {
    const { id } = req.params;
    const db = req.app.locals.ddbbClient.db('final-project'); // cojo la BBDD
    const col = db.collection('users'); // cojo la coleccion
    if (id.length === 12 || id.length === 24) {
        // genero un ObjectId de MongoDB, Controlar el pete del ID
        const o_id = ObjectId(id)
        const r = await col.updateOne({ _id: o_id }, { $set: req.body }); // busco el estudiante por su ID  
        res.status(200).json(r) // devuelvo el resultado del cliente
    }
    else {
        res.status(400).json({ error: 'Invalid ID' });
    }
}

export const deleteUserByIdCtrl = async (req, res) => {
    const { id } = req.params;
    const db = req.app.locals.ddbbClient.db('final-project'); // cojo la BBDD
    const col = db.collection('users'); // cojo la coleccion
    if (id.length === 12 || id.length === 24) {
        // genero un ObjectId de MongoDB, Controlar el pete del ID
        const o_id = ObjectId(id)
        const r = await col.deleteOne({ _id: o_id }); // busco el estudiante por su ID  
        res.status(200).json(r) // devuelvo el resultado del cliente
    }
    else {
        res.status(400).json({ error: 'Invalid ID' });
    }
}

export const putUserCtrl = async (req, res) => {
    const db = req.app.locals.ddbbClient.db('final-project'); // cojo la BBDD
    const col = db.collection('users'); // cojo la coleccion
    const r = await col.replaceOne({ _id: ObjectId(req.params.id) }, req.body);
    res.json(r);
}

// AUTHENTICATION

export const createUser = async (user) => {
    try {
        // await client.connect();
        const db = req.app.locals.ddbbClient.db('final-project'); // cojo la BBDD
        const col = db.collection('users'); // cojo la coleccion
        return await col.insertOne(user);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}



// actualiza el usuario cambiando su estaso a success
export const validateUser = async (email) => {
    try {
        // await client.connect();
        const db = req.app.locals.ddbbClient.db('final-project'); // cojo la BBDD
        const col = db.collection('users'); // cojo la coleccion
        // create a document that sets the plot of the movie
        const updateDoc = {
            $set: {
                status: 'SUCCESS'
            },
        };
        return await col.updateOne({ email }, updateDoc);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

// devuelve el usuario de BBDDD que esté en estado succes y además coincida
// con el email y con password que me mandan. 
export const retrieveSuccessUserByEmailAndPassword = async (email, password) => {
    try {
        // await client.connect();
        const db = req.app.locals.ddbbClient.db('final-project'); // cojo la BBDD
        const col = db.collection('users'); // cojo la coleccion
        const query = {
            email,
            password,
            status: 'SUCCESS'
        }
        return await col.findOne(query);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}


export const retrieveUserInfoByEmail = async (email) => {
    try {
        // await client.connect();
        const db = req.app.locals.ddbbClient.db('final-project'); // cojo la BBDD
        const col = db.collection('users'); // cojo la coleccion
        const query = { email };
        const options = { projection: { _id: 0, password: 0, status: 0 } }
        return await col.findOne(query, options);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}


export const getUserInfo = async (req, res) => {
    // llamo al usuario
    try {
        const user = await retrieveUserInfoByEmail(req.email); // ¿Esto sale de una cosa que se llama Middleware?
        res.json(user); // deveulvo la info del usuario
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}







