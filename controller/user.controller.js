import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { users, userSessions } from '../db/schema.js';
import { randomBytes, createHmac } from 'node:crypto'

const getUserData = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        return res.status(200).json({
            success: true,
            data: user
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const [existingUser] = await db.select({
            email: users.email
        }).from(users).where(eq(users.email, email));

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `User with this email ${email} already exists`
            })
        }

        const salt = randomBytes(256).toString('hex');
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword, // wrong step: password should be hashed before storing : fixed that here,
            salt
        }).returning({ id: users.id });

        const [sessions] = await db.insert(userSessions).values({
            userId: newUser.id
        }).returning({ id: userSessions.id });

        // setting the session id in cookie while signing up
        res.cookie("sessionId", sessions.id, {
            httpOnly: true,
            sameSite: 'lax'
        })

        return res.status(201).json({
            success: true,
            data: {
                message: "User registered successfully",
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const hashedPassword = createHmac('sha256', user.salt).update(password).digest('hex');

        if (hashedPassword !== user.password) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const [sessions] = await db.insert(userSessions).values({
            userId: user.id
        }).returning({ id: userSessions.id });

        // setting the session id in cookie while logging in
        res.cookie("sessionId", sessions.id, {
            httpOnly: true,
            sameSite: 'lax'
        })

        return res.status(200).json({
            success: true,
            message: `Logged in successfully`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const updateUserData = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const { name } = req.body;

        await db.update(users).set({ name }).where(eq(users.id, user.userId));

        return res.status(200).json({
            success: true,
            message: "User information updated successfully"
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const logout = async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required"
            });
        }

        const deleted = await db.delete(userSessions).where(eq(userSessions.id, sessionId)).returning({ id: userSessions.id });

        if (deleted.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Session ID"
            });
        }

        res.clearCookie("sessionId");
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export {
    signup,
    login,
    getUserData,
    updateUserData,
    logout
}