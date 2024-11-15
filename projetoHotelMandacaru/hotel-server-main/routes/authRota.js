const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secrettoken';

router.post('/login',async (req, res) => {
    const {email, password} = req.body;
    console.log("Login attempt:", { email, password });
    try {
        // verificar se user existe
        const user = await User.findOne({ email});
        console.log("User found:", user);
        if (!user) {
            return res.status(400).json({message: 'Email inválidos'});
        }
        console.log("Plaintext password:", password);
        console.log("Hashed password from database:", user.password);
        //verifica se a senha esta correta
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'senha inválidos' });
        }
        //Gera um token JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error});
    }
});

router.post('/register', async (req,res) => {
    try {
        const { name, email, password} = req.body;
        // Verifica se o usúario já existe
        const existingUser = await User.findOne({ email});
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já registrado com este email'});
        }
        //Cria um novo usúario
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: 'Conta criada com sucesso!'});
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar conta', error });
    }
});

module.exports = router;