import db from '../db/index.js';
import { users, userSessions } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const auth = async (req, res, next) => {
    try {
        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const [session] = await db.select({
            sessionId: userSessions.id,
            userId: userSessions.userId,
            name: users.name,
            email: users.email,
        }).from(userSessions).rightJoin(users, eq(users.id, userSessions.userId)).where(eq(userSessions.id, sessionId));

        if (!session) {
            return res.status(401).json({ message: "Invalid session" });
        }

        req.user = session;
        return next();

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export default auth;