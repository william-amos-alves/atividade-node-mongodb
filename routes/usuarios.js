import {Usuario} from "../models/usuario.js";
import {usuarioValidacao} from "../utils/validations.js";
import { Router } from "express";


export const usuariosRouter = Router();

usuariosRouter.post("/usuarios", async (req, res) =>{

    const { error, value } = usuarioValidacao.validate(req.body, {
        abortEarly: false,
      });
    
      if (error) {
        res.status(400).json({ message: "Dados inválidos", error: error.details });
        return;
      }

    const { nome, email, senha } = value;
    try {
        const novoUsuario = new Usuario({
            nome,
            email,
            senha,
        });
        await novoUsuario.save();
        res.json({ message: "Usuário criado com sucesso." });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Um erro ocorreu ao adicionar usuário", erro: err });
      }
});

// LISTAGEM DE USUARIOS 
usuariosRouter.get("/usuarios", async (req, res) => {
    const listaUsuario = await Usuario.find();
    res.json(listaUsuario);
});

usuariosRouter.get("/usuarios/:id", async (req, res) => {
    const usuario = await Usuario.findById(req.params.id).select("-_v");
  
    if (usuario) {
      res.json(usuario);
    } else {
      res.json(404).json({ message: "Usuário não encontrado." });
    }
});

// ATUALIZAR DE USUARIO
usuariosRouter.put("/usuarios/:id", async (req, res) =>{

    const { error, value } = usuarioValidacao.validate(req.body, {
        abortEarly: false,
      });
    
      if (error) {
        res.status(400).json({ message: "Dados inválidos", error: error.details });
        return;
      }

    const { nome, email, senha } = value;

    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, {
          nome,
          email,
          senha,
        });
    
        if (usuario) {
          res.json({ message: "Usuário atualizado com sucesso." });
        } else {
          res.status(404).json({ message: "Usuário não encontrado." });
        }
      } catch (err) {
        res
          .status(500)
          .json({ message: "Um erro ocorreu ao atualizar", error: err });
      }
});

// REMOÇAO DE USUARIO
usuariosRouter.delete("/usuarios/:id", async (req, res) => {
    try {
      const usuario = await Usuario.findByIdAndDelete(req.params.id);
  
      if (usuario) {
        res.json({ message: "Usuário removido com secesso." });
      } else {
        res.status(404).json({ message: "Usuário não encontrado." });
      }
    } catch (err) {
      res.status(500).json({ message: "Um erro ocerreu ao remover", erro: err });
    }
  });