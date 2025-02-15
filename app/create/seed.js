import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: "LinkedIn Premium", category: "Career", price: "$30", currency: "₹2500", image: "/products/linkedin.png" },
      { name: "AlgoExpert", category: "Learning", price: "$25", currency: "₹2000", image: "/products/algoexpert.png" },
      { name: "Programming Expert", category: "Learning", price: "$12", currency: "₹1000", image: "/products/programmingExpert.png" },
      { name: "Blinkist", category: "Learning", price: "$10", currency: "₹800", image: "/products/blinkist.png" },
      { name: "SmallPDF", category: "Utilities", price: "$5", currency: "₹500", image: "/products/smallpdf.png" },
      { name: "iLovePDF", category: "Utilities", price: "$6", currency: "₹600", image: "/products/ilovepdf.png" },
      { name: "Beautiful AI", category: "Design", price: "$15", currency: "₹1200", image: "/products/beautifulai.png" },
      { name: "Coursera Plus", category: "Learning", price: "$20", currency: "₹1600", image: "/products/coursera.png" },
      { name: "ChatGPT Plus", category: "AI", price: "$20", currency: "₹1600", image: "/products/chatgpt.png" },
      { name: "Claude AI", category: "AI", price: "$20", currency: "₹1600", image: "/products/claudeai.png" },
    ],
  });
  console.log("Database Seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
