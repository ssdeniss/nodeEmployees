const {prisma} = require('../prisma/prisma-client')
const brypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const login = async (req, res) => {

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'Missing email or password'});
    }
    const user = await prisma.user.findFirst({
        where: {email}
    });

    const isPasswordCorrect = user && (await brypt.compare(password, user.password));

    if (user && isPasswordCorrect) {
        res.status(200).json({id: user.id, email: user.email, name: user.name})
    } else {
        return res.status(400).json({message: 'Invalid email or password'});
    }
}

const register = async (req, res) => {
    const {name, email, password} = req.body

    if (!email || !name || !password) {
        return res.status(400).json({message: 'Missing email, name or password'});
    }

    const registeredUser = await prisma.user.findFirst({
        where: {email}
    })

    if (registeredUser) {
        return res.status(400).json({message: 'Email already in use'});
    }

    const hashedPassword = await brypt.hash(password, 10)
    const newUser = await prisma.user.create({
        data: {name, email, password: hashedPassword}
    })

    const secret = process.env.JWT_SECRET;
    if (newUser && secret) {
        const token = jwt.sign({id: newUser.id, email: newUser.email, name: newUser.name}, secret, {expiresIn: '7d'});
        res.status(201).json({id: newUser.id, email: newUser.email, name: newUser.name, token})
    } else {
        return res.status(400).json({message: "Can't create new user"})
    }


}

const current = async (req, res) => {
    res.send('current');
}

module.exports = {login, register, current};