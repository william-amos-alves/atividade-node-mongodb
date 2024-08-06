import { Contato } from "../models/contato.js";
import { contatoValidacao } from "../utils/validations.js";
import { Router } from "express";

export const contatosRouter = Router();

// INSERÇÃO DE CONTATO [POST]
contatosRouter.post("/contatos", async (req, res) => {
  // Erro -> objeto com detalhes dos erros de validação
  // value -> são os dados do req.body
  const { error, value } = contatoValidacao.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    // HTTP 400 - Bad Request - Indica que a requisição tem dados inválidos
    res.status(400).json({ message: "Dados inválidos", error: error.details });
    return;
  }
  // Extrair as informações dos dados qie foram validados anteriormente
  const { nome, sobrenome, email, telefone, observacoes, favorito } = value;

  try {
    const novoContato = new Contato({
      nome,
      sobrenome,
      email,
      telefone,
      observacoes,
      favorito,
    });
    await novoContato.save();
    res.json({ message: "Contato criado com sucesso." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Um erro ocorreu ao adicionar contato", erro: err });
  }
});
// LISTAGEM DE CONTATOS [GET]
contatosRouter.get("/contatos", async (req, res) => {
  const lista = await Contato.find();
  res.json(lista);
});

contatosRouter.get("/contatos/:id", async (req, res) => {
  const contato = await Contato.findById(req.params.id).select("-_v");

  if (contato) {
    res.json(contato);
  } else {
    res.json(404).json({ message: "Contato não encontrado." });
  }
});

// ATUALIZAR DE CONTATO [PUT]
contatosRouter.put("/contatos/:id", async (req, res) => {
    
  const { error, value } = contatoValidacao.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res.status(400).json({ message: "Dados inválidos", error: error.details });
    return;
  }

  const { nome, sobrenome, email, telefone, observacoes, favorito } = value;

  try {
    // Ele procura pelo contato indicado pelo ID, se existir ele será atualizado
    const contato = await Contato.findByIdAndUpdate(req.params.id, {
      nome,
      sobrenome,
      email,
      telefone,
      observacoes,
      favorito,
    });

    if (contato) {
      res.json({ message: "Contato atualizado com sucesso." });
    } else {
      res.status(404).json({ message: "Contato não encontrado." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Um erro ocorreu ao atualizar", error: err });
  }
});

// REMOÇAO DE CONTATO [DELETE]
contatosRouter.delete("/contatos/:id", async (req, res) => {
  try {
    const contato = await Contato.findByIdAndDelete(req.params.id);

    if (contato) {
      res.json({ message: "Contato removido com secesso." });
    } else {
      res.status(404).json({ message: "Contato não encontrado." });
    }
  } catch (err) {
    res.status(500).json({ message: "Um erro ocerreu ao remover", erro: err });
  }
});
