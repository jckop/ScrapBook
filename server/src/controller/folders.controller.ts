import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { authenticateUser } from "../service";
import { log, LogType } from "../util/log.util";

const prisma = new PrismaClient();

// POST :8080/folders/forUser
// Returns all folders that belong to a user
export const foldersForUser = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  const folders = await prisma.folder.findMany({
    where: {
      users: {
        some: {
          id: response.account.id
        }
      }
    }
  });

  res.status(200).json({ success: true, folders, ...response });  
}

// POST :8080/folders
// Create a new user folder
export const createFolder = async (req: Request, res: Response) => {
  const accessToken: string = req.body?.accessToken || "";
  const refreshToken: string = req.body?.refreshToken || "";
  const label: string = req.body?.label || "New Folder";
  const { success, response } = await authenticateUser(accessToken, refreshToken);
  if (!success) {
    log(LogType.ERROR, JSON.stringify(response));
    res.status(400).json({ success, error: "Invalid account" });
    return;
  }

  await prisma.folder.create({
    data: {
      label,
      posts: {
        connect: []
      },
      users: {
        connect: { id: response.account.id }
      }
    }
  });

  const userFolders = await prisma.folder.findMany({
    where: {
      users: {
        some: { id: response.account.id }
      }
    }
  });

  res.status(200).json({ success: true, folders: userFolders, ...response });  
}