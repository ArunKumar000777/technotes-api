import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//@desc login
//@route POST /auth
//@access public

export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    //confirm data
    if (!username || !password) {
        return res.status(400).json({ message: "all fields are required" });
    }
    const user = await User.findOne({ username }).exec();
    if (!user || !user.active) res.status(401).json({ message: "unauthorized" });
    const matchPwd = await bcrypt.compare(password, user.password);
    if (!matchPwd) res.status(400).json({ message: "password not matching" });

    const accessToken = jwt.sign(
        {
            UserInfo: {
                username: user.username,
                roles: user.roles,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        {
            UserInfo: {
                username: user.username,
            },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: "None", //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
    // Send accessToken containing username and roles
    res.json({ accessToken });
});

//@desc refresh
//@route GET /auth/refresh
//@access public because access token has expired
export const refresh = asyncHandler(async (req, res) => {
    const cookeis = req.cookies;
    if (!cookeis?.jwt) return res.status(401).json({ message: "unautherized" });
    const refreshToken = cookeis.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: "forbidden" });
            const user = await User.findOne({ username: decoded.UserInfo.username }).exec();
            if (!user) return res.status(401).json({ message: "unauthorizeddd" });

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: user.username,
                        roles: user.roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );
            res.json({ accessToken });
        })
    );
});

//@desc logout
//@route POST /auth/logout
//@access public just to clear if cookie exists
export const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "cookie cleared" });
});
