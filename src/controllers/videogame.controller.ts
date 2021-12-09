import { Request, Response } from "express";
import Videogame from "../models/videogame.model";
import log from "../logger";

const NAMESPACE = "Videogame controller";

export const getAllVideogames = (req: Request, res: Response) => {
  try {
    let query = Videogame.find();
    const limit = Math.abs(Number(req.query.limit)) || 10;
    const page = (Math.abs(Number(req.query.page)) || 1) - 1;
    //@ts-ignore
    if (req.userRoleId !== process.env.ADMIN_ROLE_ID)
      query = Videogame.find({ active: true });
    query
      .limit(limit)
      .skip(limit * page)
      .populate("companies", "name")
      .populate("consoles", "name")
      .exec((error, videogames) => {
        if (error) return res.status(500).json({ error: error.message });
        Videogame.count().exec((error, count) => {
          if (error) return res.status(500).json({ error: error.message });

          return res.json({
            videogames,
            count,
            pages: Math.ceil(count / limit),
          });
        });
      });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getVideogameByName = (req: Request, res: Response) => {
  try {
    const videogameName = req.params.name;
    let query = Videogame.findOne({ name: videogameName });
    //@ts-ignore
    if (req.userRoleId !== process.env.ADMIN_ROLE_ID)
      query = Videogame.findOne({ active: true, name: videogameName });
    query
      .populate("companies", "name")
      .populate("consoles", "name")
      .exec((error, videogame) => {
        if (error) return res.status(500).json({ error: error.message });

        if (!videogame)
          return res.status(404).json({ error: "Videogame not found" });

        return res.status(200).json({ videogame: videogame });
      });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getVideogame = (req: Request, res: Response) => {
  try {
    const videogameId = req.params.id;
    let query = Videogame.findById(videogameId);
    //@ts-ignore
    if (req.userRoleId !== process.env.ADMIN_ROLE_ID)
      query = Videogame.findById(videogameId, { active: true });
    query
      .populate("companies", "name")
      .populate("consoles", "name")
      .exec((error, videogame) => {
        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ videogame });
      });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const createVideogame = (req: Request, res: Response) => {
  //@ts-ignore
  const imageData = req.files.image.data;
  //@ts-ignore
  const imageType = req.files.image.mimetype;
  const videogameData = new Videogame({
    ...req.body,
    image: imageData,
    imageType,
  });
  try {
    videogameData
      .save()
      .then((videogame) => {
        log.info(NAMESPACE, `New videogame added: ${videogame.name}`);
        return res.status(201).json({ videogame });
      })
      .catch((error) => {
        log.error(NAMESPACE, "Error when adding a new videogame", error);
        return res.status(500).json(error);
      });
  } catch (error) {
    log.error(NAMESPACE, "Error when adding a new videogame", error);
    return res.status(500).json(error);
  }
};

export const updateVideogame = (req: Request, res: Response) => {
  const videogameId = req.params.id;

  try {
    Videogame.findByIdAndUpdate(videogameId, req.body, {
      returnDocument: "after",
    })
      .populate("companies", "name")
      .populate("consoles", "name")
      .exec((error, console) => {
        if (error) return res.status(500).json({ error: error.message });

        if (!console)
          return res.status(404).json({ error: "Videogame not found" });

        return res.json({ console });
      });
  } catch (error) {
    log.error(NAMESPACE, "Error when updating the videogame", error);
    return res.status(500).json(error);
  }
};

//Logical delete
export const logicalDeleteVideogame = (req: Request, res: Response) => {
  const videogameId = req.params.id;

  try {
    Videogame.findByIdAndUpdate(videogameId, { active: false }).exec(
      (error, videogame) => {
        if (error) return res.status(500).json({ error: error.message });

        if (!videogame)
          return res.status(404).json({ error: "Console not found" });

        return res.sendStatus(200);
      }
    );
  } catch (error) {
    log.error(NAMESPACE, "Error when deleting the videogame", error);
    return res.status(500).json(error);
  }
};
