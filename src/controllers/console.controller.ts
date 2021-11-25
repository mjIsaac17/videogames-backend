import { Request, Response } from "express";
import Console from "../models/console.model";
import log from "../logger";

const NAMESPACE = "Console controller";

export const getAllConsoles = (req: Request, res: Response) => {
  try {
    let query = Console.find();
    //@ts-ignore
    if (req.userRoleId !== process.env.ADMIN_ROLE_ID)
      query = Console.find({ active: true });
    query.populate("companyId", "name").exec((error, consoles) => {
      if (error) return res.status(500).json({ error: error.message });

      return res.json({ consoles });
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
  const consoleData = new Console(req.body);

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
