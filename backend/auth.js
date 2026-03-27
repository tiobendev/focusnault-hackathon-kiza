import jwt from 'jsonwebtoken';


export function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    // verifica se ta com token
    if(!authHeader) {
        return res.status(401).json({ error: 'Token missing'})
    }

    // formnato : Bearer TOKEN
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, "batatinhaFrita123");

        // salva dados do user na req
        req.user = decoded;

        next();
    }catch(error){
        return res.status(401).json({ error: 'invalid token'})
    }
}