"use server";

import { prisma } from "@/lib/prisma";

export async function getDevelopers() {
  try {
    const developers = await prisma.developer.findMany({
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
    });

    return developer;
  } catch (error) {
    console.error(`Error fetching developer with ID ${id}:`, error);
    return null;
  }
}

// export async function getProjects() {
//   try {
//     const projects = await prisma.project.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         developer: true,
//       },
//     });

//     return projects;
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     return [];
//   }
// }

// export async function getProjectById(id: string) {
//   try {
//     const project = await prisma.project.findUnique({
//       where: { id },
//       include: {
//         developer: true,
//       },
//     });

//     return project;
//   } catch (error) {
//     console.error(`Error fetching project with ID ${id}:`, error);
//     return null;
//   }
// }

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

export async function getLink() {
  try {
    // Get the first link (we only keep one)
    const link = await prisma.link.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    return link;
  } catch (error) {
    console.error("Error fetching link:", error);
    return null;
  }
}

export async function upsertLink(url: string) {
  try {
    // First get all existing links
    const existingLinks = await prisma.link.findMany();

    // Delete all existing links if any exist
    if (existingLinks.length > 0) {
      await prisma.link.deleteMany({});
    }

    // Create the new link
    const newLink = await prisma.link.create({
      data: {
        url,
      },
    });

    return newLink;
  } catch (error) {
    console.error("Error updating link:", error);
    throw new Error("Failed to update link");
  }
}

export async function deleteLink() {
  try {
    // Delete all existing links
    await prisma.link.deleteMany({});
    return { success: true };
  } catch (error) {
    console.error("Error deleting link:", error);
    throw new Error("Failed to delete link");
  }
}

export async function getWebsiteData() {
  try {
    const websiteData = await prisma.websiteData.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    return websiteData;
  } catch (error) {
    console.error("Error fetching website data:", error);
    return null;
  }
}

export async function updateWebsiteData(formData: FormData) {
  try {
    // Get existing website data
    const existingData = await prisma.websiteData.findFirst();

    // Handle banner image
    let banner = existingData?.banner || null;
    const bannerDataUrl = formData.get("banner") as string | null;
    const keepExistingBanner = formData.get("keepExistingBanner") === "true";

    if (bannerDataUrl) {
      // Use the data URL directly
      banner = bannerDataUrl;
    } else if (!keepExistingBanner) {
      // If not keeping existing and no new image, set to null
      banner = null;
    }

    // Handle about image
    let aboutImage = existingData?.aboutImage || null;
    const aboutImageDataUrl = formData.get("aboutImage") as string | null;
    const keepExistingAboutImage =
      formData.get("keepExistingAboutImage") === "true";

    if (aboutImageDataUrl) {
      // Use the data URL directly
      aboutImage = aboutImageDataUrl;
    } else if (!keepExistingAboutImage) {
      // If not keeping existing and no new image, set to null
      aboutImage = null;
    }

    // Get about text
    const about =
      (formData.get("about") as string) || existingData?.about || null;

    // If we have existing data, update it
    if (existingData) {
      const updatedData = await prisma.websiteData.update({
        where: { id: existingData.id },
        data: {
          banner,
          about,
          aboutImage,
        },
      });
      return updatedData;
    }
    // Otherwise create a new record
    else {
      const newData = await prisma.websiteData.create({
        data: {
          banner,
          about,
          aboutImage,
        },
      });
      return newData;
    }
  } catch (error) {
    console.error("Error updating website data:", error);
    throw new Error("Failed to update website data");
  }
}
