const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: "LinkedIn Premium", category: "Career", price: "$30", currency: "₹2500", image: "/products/linkedin.png" },
    { name: "AlgoExpert", category: "Learning", price: "$25", currency: "₹2000", image: "/products/algoexpert.png" },
    { name: "Programming Expert", category: "Learning", price: "$12", currency: "₹1000", image: "/products/programmingExpert.png" },
    { name: "Blinkist", category: "Learning", price: "$10", currency: "₹800", image: "/products/blinkist.png" },
    { name: "SmallPDF", category: "Utilities", price: "$5", currency: "₹500", image: "/products/smallpdf.png" },
    { name: "iLovePDF", category: "Utilities", price: "$6", currency: "₹600", image: "/products/ilovepdf.png" },
    { name: "Beautiful AI", category: "Design", price: "$15", currency: "₹1200", image: "/products/beautifulai.png" },
    { name: "Coursera Plus", category: "Learning", price: "$20", currency: "₹1600", image: "/products/coursera.png" },
    { name: "ChatGPT Plus", category: "AI", price: "$13", currency: "₹1200", image: "/products/chatgpt.png" },
    { name: "Claude AI", category: "AI", price: "$13", currency: "₹1200", image: "/products/claudeai.png" },
    { name: "Perplexity AI", category: "AI", price: "$25", currency: "₹2000", image: "/products/perplexity.png" },
    { name: "Canva pro", category: "Design", price: "$5", currency: "₹450", image: "/products/canva.png" },
    { name: "Adobe Creative Cloud", category: "Design", price: "$2", currency: "₹130", image: "/products/adobe.png" },
    { name: "Autodesk All Apps", category: "Design", price: "$25", currency: "₹2200", image: "/products/autodesk.png" },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name }, // Uses the now unique name field
      update: {}, // No updates, only insert if not exists
      create: product,
    });
  }

  console.log("Database Seeded without Duplicates!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
