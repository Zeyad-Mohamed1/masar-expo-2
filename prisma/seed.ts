import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const userData = [
  {
    name: "Admin",
    email: "admin@masarexpo.com",
    password: bcrypt.hashSync("masarexpo2025", 10),
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.admin.create({ data: u });
  }
}

main();
