const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🗑 Cleaning up old features...");
  
  // ✅ **STEP 1: Delete ALL Features Before Re-Seeding**
  await prisma.feature.deleteMany({}); // This removes duplicates before inserting new ones

  console.log("✅ Existing features removed!");

  // ✅ First, Seed Products
  const products = [
    { name: "LinkedIn Premium Business", category: "Professional", price: "$30", currency: "₹2500", image: "/products/linkedin.png", billingCycle: "6 Months" },
    { name: "LinkedIn Premium Career", category: "Professional", price: "$30", currency: "₹2500", image: "/products/linkedin.png", billingCycle: "Yearly" },
    { name: "AlgoExpert", category: "Learning", price: "$25", currency: "₹2000", image: "/products/algoexpert.png", billingCycle: "Yearly" },
    { name: "Programming Expert", category: "Learning", price: "$12", currency: "₹1000", image: "/products/programmingExpert.png", billingCycle: "Yearly" },
    { name: "Blinkist", category: "Learning", price: "$10", currency: "₹800", image: "/products/blinkist.png", billingCycle: "Monthly" },
    { name: "SmallPDF", category: "Utilities", price: "$5", currency: "₹500", image: "/products/smallpdf.png", billingCycle: "Yearly" },
    { name: "iLovePDF", category: "Utilities", price: "$6", currency: "₹600", image: "/products/ilovepdf.png", billingCycle: "Yearly" },
    { name: "Beautiful AI", category: "Design", price: "$15", currency: "₹1200", image: "/products/beautifulai.png", billingCycle: "Yearly" },
    { name: "Coursera Plus", category: "Learning", price: "$20", currency: "₹1600", image: "/products/coursera.png", billingCycle: "Yearly" },
    { name: "ChatGPT Plus", category: "AI", price: "$13", currency: "₹1200", image: "/products/chatgpt.png", billingCycle: "Monthly" },
    { name: "Claude AI", category: "AI", price: "$13", currency: "₹1200", image: "/products/claudeai.png", billingCycle: "Monthly" },
    { name: "Perplexity AI", category: "AI", price: "$25", currency: "₹2000", image: "/products/perplexity.png", billingCycle: "Monthly" },
    { name: "Canva Pro", category: "Design", price: "$5", currency: "₹450", image: "/products/canva.png", billingCycle: "Yearly" },
    { name: "Adobe Creative Cloud", category: "Design", price: "$2", currency: "₹130", image: "/products/adobe.png", billingCycle: "Monthly" },
    { name: "Autodesk All Apps", category: "Design", price: "$25", currency: "₹2200", image: "/products/autodesk.png", billingCycle: "Yearly" },
    { name: "Netflix Premium", category: "Entertainment", price: "$15", currency: "₹1200", image: "/products/netflix.png", billingCycle: "Monthly" },
    { name: "Spotify Premium", category: "Entertainment", price: "$10", currency: "₹800", image: "/products/spotify.png", billingCycle: "Monthly" },
    { name: "Amazon Prime", category: "Entertainment", price: "$12", currency: "₹1000", image: "/products/prime.png", billingCycle: "Yearly" },
    { name: "Grammarly Premium", category: "Utilities", price: "$20", currency: "₹1600", image: "/products/grammarly.png", billingCycle: "Monthly" },
    { name: "Dropbox Pro", category: "Utilities", price: "$15", currency: "₹1200", image: "/products/dropbox.png", billingCycle: "Monthly" },
    { name: "Google Workspace", category: "Professional", price: "$25", currency: "₹2000", image: "/products/workspace.png", billingCycle: "Yearly" },
    { name: "Notion Plus", category: "Productivity", price: "$8", currency: "₹650", image: "/products/notion.png", billingCycle: "Monthly" },
    { name: "Evernote Pro", category: "Productivity", price: "$10", currency: "₹800", image: "/products/evernote.png", billingCycle: "Yearly" },
    { name: "Figma Pro", category: "Design", price: "$15", currency: "₹1200", image: "/products/figma.png", billingCycle: "Monthly" },
  ];
  

  // ✅ Features for Each Product (Now Unique!)
  const features = [
    { productName: "LinkedIn Premium Business", description: "Access exclusive job insights" },
    { productName: "LinkedIn Premium Business", description: "InMail messaging available" },
    { productName: "LinkedIn Premium Business", description: "See who viewed your profile" },
    { productName: "LinkedIn Premium Business", description: "Exclusive learning courses" },

    { productName: "AlgoExpert", description: "Comprehensive coding interview prep" },
    { productName: "AlgoExpert", description: "100+ data structures and algorithms problems" },
    { productName: "AlgoExpert", description: "Mock coding interviews available" },
    { productName: "AlgoExpert", description: "Video solutions for all problems" },

    { productName: "ChatGPT Plus", description: "Faster AI responses" },
    { productName: "ChatGPT Plus", description: "Access to GPT-4 Turbo" },
    { productName: "ChatGPT Plus", description: "Priority access during peak times" },
    { productName: "ChatGPT Plus", description: "Better performance on complex queries" },
  ];

  // ✅ Insert Products into Database (Upsert to Avoid Duplicates)
  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });

    console.log(`✔ Product added: ${createdProduct.name}`);
  }

  // ✅ Insert Features (Now without duplicates)
  for (const feature of features) {
    const product = await prisma.product.findUnique({
      where: { name: feature.productName },
    });

    if (product) {
      // **Check if feature already exists before inserting**
      const existingFeature = await prisma.feature.findFirst({
        where: {
          productId: product.id,
          description: feature.description,
        },
      });

      if (!existingFeature) {
        await prisma.feature.create({
          data: {
            productId: product.id,
            description: feature.description,
          },
        });

        console.log(`✔ Feature added: ${feature.description} to ${product.name}`);
      } else {
        console.warn(`⚠️ Feature already exists: ${feature.description} in ${product.name}`);
      }
    } else {
      console.warn(`❌ Product not found for feature: ${feature.description}`);
    }
  }

  console.log("✅ Database Seeding Complete!");
}

// ✅ Run the Seed Script
main()
  .catch((e) => console.error("❌ Error seeding database:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
