import { ObjectId } from "mongodb";

const DATABASE_NAME = 'final-project';
const COLLECTION_NAME = 'favorites';

const connectToDatabase = (req) => {
    const db = req.app.locals.ddbbClient.db(DATABASE_NAME);
    return db.collection(COLLECTION_NAME);
}

export const getFavoritesUserCtrl = async (req, res) => {
    const user = req.params.id;

    const favorites = connectToDatabase(req);
    const favoritesUser = await favorites.findOne({ user })

    res.status(200).json({ data: { favorites: favoritesUser ? favoritesUser.favorites: [] } });
};

export const updateFavoritesUserCtrl = async (req, res) => {
    const user = req.params.id;
    const favorite = req.body;
    const favorites = connectToDatabase(req);

    const favoritesUser = await favorites.findOne({ user })

    if (favoritesUser === null) {
        const response = await favorites.insertOne({ user, favorites: [favorite] });
        const favoritesUser = await favorites.findOne({ user })
        res.status(200).json({ data: { favorites: favoritesUser ? favoritesUser.favorites: [] } });
    } else {
        const isFavoriteAlreadyAdded = !!favoritesUser.favorites.find(f => f.id === favorite.id);
    
        if (!isFavoriteAlreadyAdded) {
            const updateDoc = {
                $push: {
                    favorites: favorite
                },
            };
            
            await favorites.updateOne({ user }, updateDoc);
            const favoritesUser = await favorites.findOne({ user })
            res.status(200).json({ data: { favorites: favoritesUser ? favoritesUser.favorites: [] } });
        } else {
            res.status(409).json({ message: 'Media has already added', error: true });
        }
    }
};

export const deleteFavoritesUserCtrl = async (req, res) => {
    const user = req.params.id;
    const favorite = req.body;
    const favorites = connectToDatabase(req);

    const updateDoc = {
        $pull: {
            favorites: favorite
        },
    };
    
    await favorites.updateOne({ user }, updateDoc);
    const favoritesUser = await favorites.findOne({ user })
    res.status(200).json({ data: { favorites: favoritesUser ? favoritesUser.favorites: [] } });
}
