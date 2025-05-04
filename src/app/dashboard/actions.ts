"use server";

import { prisma } from "@/lib/prisma";

export async function getDevelopers() {
  try {
    const developers = await prisma.developer.findMany({
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return developers;
  } catch (error) {
    console.error("Error fetching developers:", error);
    return [];
  }
}

export async function getDeveloperById(id: string) {
  try {
    const developer = await prisma.developer.findUnique({
      where: { id },
      include: {
        projects: true,
      },
    });

    return developer;
  } catch (error) {
    console.error(`Error fetching developer with ID ${id}:`, error);
    return null;
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        developer: true,
      },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        developer: true,
      },
    });

    return project;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
}

export async function getVisitors() {
  try {
    const visitors = await prisma.visitor.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (visitors.length === 0) {
      return [];
    }

    return visitors;
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return [];
  }
}
