import { Request, Response } from "express";
import Console from "../models/console.model";
import log from "../logger";

const NAMESPACE = "Console controller";

export const getAllConsoles = (req: Request, res: Response) => {
  try {
    let query = Console.find();
    const limit = Math.abs(Number(req.query.limit)) || 10;
    const page = (Math.abs(Number(req.query.page)) || 1) - 1;

    //@ts-ignore
    if (req.userRoleId !== process.env.ADMIN_ROLE_ID)
      query = Console.find({ active: true });
    query
      .limit(Number(limit))
      .skip(limit * page)
      .populate("companyId", "name")
      .exec((error, consoles) => {
        if (error) return res.status(500).json({ error: error.message });
        Console.count().exec((error, count) => {
          if (error) return res.status(500).json({ error: error.message });
          return res.json({
            consoles,
            count,
            pages: Math.ceil(count / limit),
          });
        });
      });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getConsole = (req: Request, res: Response) => {
  try {
    const consoleId = req.params.id;
    let query = Console.findById(consoleId);
    //@ts-ignore
    if (req.userRoleId !== process.env.ADMIN_ROLE_ID)
      query = Console.findById(consoleId, { active: true });
    query.populate("companyId", "name").exec((error, console) => {
      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ console });
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const createConsole = (req: Request, res: Response) => {
  //@ts-ignore
  const imageData = req.files.image.data;
  //@ts-ignore
  const imageType = req.files.image.mimetype;

  const consoleData = new Console({ ...req.body, image: imageData, imageType });

  try {
    consoleData
      .save()
      .then((console) => {
        log.info(NAMESPACE, `New console added: ${console.name}`);
        return res.status(201).json({ console });
      })
      .catch((error) => {
        log.error(NAMESPACE, "Error when adding a new console", error);
        return res.status(500).json(error);
      });
  } catch (error) {
    log.error(NAMESPACE, "Error when adding a new console", error);
    return res.status(500).json(error);
  }
};

export const updateConsole = (req: Request, res: Response) => {
  const consoleId = req.params.id;

  try {
    Console.findByIdAndUpdate(consoleId, req.body, { returnDocument: "after" })
      .populate("companyId", "name")
      .exec((error, console) => {
        if (error) return res.status(500).json({ error: error.message });

        if (!console)
          return res.status(404).json({ error: "Console not found" });

        return res.json({ console });
      });
  } catch (error) {
    log.error(NAMESPACE, "Error when updating the console", error);
    return res.status(500).json(error);
  }
};

//Logical delete
export const logicalDeleteConsole = (req: Request, res: Response) => {
  const consoleId = req.params.id;

  try {
    Console.findByIdAndUpdate(consoleId, { active: false }).exec(
      (error, console) => {
        if (error) return res.status(500).json({ error: error.message });

        if (!console)
          return res.status(404).json({ error: "Console not found" });

        return res.sendStatus(200);
      }
    );
  } catch (error) {
    log.error(NAMESPACE, "Error when deleting the console", error);
    return res.status(500).json(error);
  }
};
