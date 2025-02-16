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
    { name: "EDX Pro", category: "Learning", price: "$15", currency: "₹1200", image: "/products/edx.png", billingCycle: "Yearly" },
    { name: "Zoom Pro", category: "Professional", price: "$50", currency: "₹4500", image: "/products/zoom.png", billingCycle: "Yearly" },
    { name: "Youtube Premium", category: "Entertainment", price: "$10", currency: "₹900", image: "/products/youtube.png", billingCycle: "Yearly" },
    { name: "Youtube Premium", category: "Entertainment", price: "$3", currency: "₹200", image: "/products/youtube.png", billingCycle: "3 Months" },
    { name: "Arike Dating", category: "Dating", price: "$12", currency: "₹850", image: "/products/arike.png", billingCycle: "3 Months" },
    { name: "Arike Dating", category: "Dating", price: "$25", currency: "₹2000", image: "/products/arike.png", billingCycle: "6 Months" },
    { name: "Pure Dating", category: "Dating", price: "$25", currency: "₹2000", image: "/products/pure.png", billingCycle: "Monthly" },
    { name: "Pure Dating", category: "Dating", price: "$25", currency: "₹2000", image: "/products/pure.png", billingCycle: "Monthly" },
    { name: "Mega Pro", category: "Utilities", price: "$4", currency: "₹249", image: "/products/mega.png", billingCycle: "Monthly" },
    { name: "Datacamp", category: "Learning", price: "$8", currency: "₹899", image: "/products/datacamp.png", billingCycle: "3 Months" },
    { name: "Datacamp", category: "Learning", price: "$16", currency: "₹1499", image: "/products/datacamp.png", billingCycle: "6 Months" },
    { name: "Zee5 Premium", category: "Entertainment", price: "$8", currency: "₹400", image: "/products/zee5.png", billingCycle: "Yearly" },
    { name: "JioHotstar Premium", category: "Entertainment", price: "$14", currency: "₹1199", image: "/products/hotstar.png", billingCycle: "Yearly" },
    { name: "Trading View Premium", category: "Utilities", price: "$9", currency: "₹799", image: "/products/tradingview.png", billingCycle: "Monthly" },
    { name: "SUN NXT ", category: "Entertainment", price: "$6", currency: "₹599", image: "/products/sunnxt.png", billingCycle: "Yearly" },
    { name: "Microsoft Office 365", category: "Professional", price: "$20", currency: "₹1899", image: "/products/microsoft.png", billingCycle: "Yearly" },
    { name: "SonyLiv Premium", category: "Entertainment", price: "$5", currency: "₹399", image: "/products/sony.png", billingCycle: "Yearly" },
    { name: "PCLOUD", category: "Utilities", price: "$30", currency: "₹2800", image: "/products/pcloud.png", billingCycle: "Yearly" },
    { name: "Tinder Gold", category: "Dating", price: "$35", currency: "₹3400", image: "/products/gold.png", billingCycle: "Yearly" },
    { name: "Quilbot Premium", category: "Utilities", price: "$20", currency: "₹1800", image: "/products/quilbot.png", billingCycle: "Yearly" },
    { name: "Tinder Platinum", category: "Dating", price: "$50", currency: "₹5000", image: "/products/tinder.png", billingCycle: "Yearly" },
    { name: "Educative Premium", category: "Learning", price: "$80", currency: "₹7000", image: "/products/educative.png", billingCycle: "Yearly" },
    { name: "Leetcode Premium", category: "Learning", price: "$80", currency: "₹7000", image: "/products/leetcode.png", billingCycle: "Yearly" },
    { name: "Codeacademy Pro", category: "Learning", price: "$7", currency: "₹600", image: "/products/codeacademy.png", billingCycle: "Monthly" },
    { name: "You.com", category: "AI", price: "$15", currency: "₹1400", image: "/products/you.png", billingCycle: "Yearly" },
  ];

  // ✅ Features for Each Product (Now Unique!)
  const features = [
    // LinkedIn Premium Business
    { productName: "LinkedIn Premium Business", description: "Access exclusive job insights" },
    { productName: "LinkedIn Premium Business", description: "InMail messaging available" },
    { productName: "LinkedIn Premium Business", description: "See who viewed your profile" },
    { productName: "LinkedIn Premium Business", description: "Exclusive learning courses" },
    { productName: "LinkedIn Premium Business", description: "Activating on your existing account" },
    { productName: "LinkedIn Premium Business", description: "Full 6 month access" },

    // LinkedIn Premium Career
    { productName: "LinkedIn Premium Career", description: "Job application insights" },
    { productName: "LinkedIn Premium Career", description: "Resume builder and tips" },
    { productName: "LinkedIn Premium Career", description: "Access to LinkedIn Learning" },
    { productName: "LinkedIn Premium Career", description: "Profile optimization tools" },
    { productName: "LinkedIn Premium Career", description: "Activating on your existing account" },
    { productName: "LinkedIn Premium Career", description: "Full 1 year access" },

    // AlgoExpert
    { productName: "AlgoExpert", description: "Comprehensive coding interview prep" },
    { productName: "AlgoExpert", description: "100+ data structures and algorithms problems" },
    { productName: "AlgoExpert", description: "Mock coding interviews available" },
    { productName: "AlgoExpert", description: "Video solutions for all problems" },
    { productName: "AlgoExpert", description: "Activating on your google/github account" },
    { productName: "AlgoExpert", description: "All modules unlocked" },
    { productName: "AlgoExpert", description: "Full 1 year access" },

    // Programming Expert
    { productName: "Programming Expert", description: "In-depth programming tutorials" },
    { productName: "Programming Expert", description: "Interactive coding challenges" },
    { productName: "Programming Expert", description: "Community support and forums" },
    { productName: "Programming Expert", description: "Project-based learning" }, 
    { productName: "Programming Expert", description: "Activating on your google/github account" },
    { productName: "Programming Expert", description: "Full 1 year access" },


    // Blinkist
    { productName: "Blinkist", description: "Summaries of best-selling books" },
    { productName: "Blinkist", description: "Audio versions for on-the-go learning" },
    { productName: "Blinkist", description: "Personalized recommendations" },
    { productName: "Blinkist", description: "Offline access to content" },
    { productName: "Blinkist", description: "Full private 1 month access" },

    // SmallPDF
    { productName: "SmallPDF", description: "Convert PDF to various formats" },
    { productName: "SmallPDF", description: "Merge, split, and compress PDFs" },
    { productName: "SmallPDF", description: "Online PDF editor" },
    { productName: "SmallPDF", description: "Secure PDF handling" },

    // iLovePDF
    { productName: "iLovePDF", description: "PDF compression and optimization" },
    { productName: "iLovePDF", description: "PDF to Word, Excel, and other formats" },
    { productName: "iLovePDF", description: "PDF merging and splitting" },
    { productName: "iLovePDF", description: "Online PDF tools" },

    // Beautiful AI
    { productName: "Beautiful AI", description: "AI-powered presentation design" },
    { productName: "Beautiful AI", description: "Smart templates for various industries" },
    { productName: "Beautiful AI", description: "Collaborative editing" },
    { productName: "Beautiful AI", description: "Export to multiple formats" },

    // Coursera Plus
    { productName: "Coursera Plus", description: "Unlimited access to courses" },
    { productName: "Coursera Plus", description: "Certificates for completed courses" },
    { productName: "Coursera Plus", description: "Specializations and professional certificates" },
    { productName: "Coursera Plus", description: "Guided projects for hands-on learning" },
    { productName: "Coursera Plus", description: "Activating on your existing coursera account" },
    { productName: "Coursera Plus", description: "Full 1 year access hassle free learning" },

    // ChatGPT Plus
    { productName: "ChatGPT Plus", description: "Faster AI responses" },
    { productName: "ChatGPT Plus", description: "Access to GPT-4 Turbo" },
    { productName: "ChatGPT Plus", description: "Priority access during peak times" },
    { productName: "ChatGPT Plus", description: "Better performance on complex queries" },
    { productName: "ChatGPT Plus", description: "Full 1 month access" },

    // Claude AI
    { productName: "Claude AI", description: "Advanced natural language processing" },
    { productName: "Claude AI", description: "Contextual understanding" },
    { productName: "Claude AI", description: "Customizable AI responses" },
    { productName: "Claude AI", description: "Integration with various platforms" },
    { productName: "Claude AI", description: "Full 1 month access" },

    // Perplexity AI
    { productName: "Perplexity AI", description: "AI-driven insights and analytics" },
    { productName: "Perplexity AI", description: "Real-time data analysis" },
    { productName: "Perplexity AI", description: "Predictive modeling" },
    { productName: "Perplexity AI", description: "Customizable dashboards" },
    { productName: "Perplexity AI", description: "Full 1 year access" },
    { productName: "Perplexity AI", description: "Activating on your existing account" },

    // Canva Pro
    { productName: "Canva Pro", description: "Access to premium design elements" },
    { productName: "Canva Pro", description: "Brand kit for consistent branding" },
    { productName: "Canva Pro", description: "Team collaboration features" },
    { productName: "Canva Pro", description: "Magic Resize for multiple formats" },
    { productName: "Canva Pro", description: "Full 1 year access" },
    { productName: "Canva Pro", description: "Activating on your existing account" },

    // Adobe Creative Cloud
    { productName: "Adobe Creative Cloud", description: "Access to Adobe's suite of creative tools" },
    { productName: "Adobe Creative Cloud", description: "Cloud storage for projects" },
    { productName: "Adobe Creative Cloud", description: "Regular updates and new features" },
    { productName: "Adobe Creative Cloud", description: "Integration with Adobe Stock" },

    // Autodesk All Apps
    { productName: "Autodesk All Apps", description: "Access to all Autodesk design software" },
    { productName: "Autodesk All Apps", description: "Cloud-based collaboration" },
    { productName: "Autodesk All Apps", description: "3D modeling and rendering tools" },
    { productName: "Autodesk All Apps", description: "Industry-specific solutions" },

    // Netflix Premium
    { productName: "Netflix Premium", description: "Ultra HD streaming" },
    { productName: "Netflix Premium", description: "Multiple screens at once" },
    { productName: "Netflix Premium", description: "Download content for offline viewing" },
    { productName: "Netflix Premium", description: "Ad-free experience" },

    // Spotify Premium
    { productName: "Spotify Premium", description: "Ad-free music listening" },
    { productName: "Spotify Premium", description: "Offline playback" },
    { productName: "Spotify Premium", description: "High-quality audio streaming" },
    { productName: "Spotify Premium", description: "Unlimited skips" },

    // Amazon Prime
    { productName: "Amazon Prime", description: "Free two-day shipping" },
    { productName: "Amazon Prime", description: "Access to Prime Video" },
    { productName: "Amazon Prime", description: "Prime Music streaming" },
    { productName: "Amazon Prime", description: "Exclusive deals and discounts" },

    // Grammarly Premium
    { productName: "Grammarly Premium", description: "Advanced grammar and style checks" },
    { productName: "Grammarly Premium", description: "Plagiarism detection" },
    { productName: "Grammarly Premium", description: "Vocabulary enhancement suggestions" },
    { productName: "Grammarly Premium", description: "Integration with multiple platforms" },

    // Dropbox Pro
    { productName: "Dropbox Pro", description: "1TB of storage space" },
    { productName: "Dropbox Pro", description: "Advanced sharing and collaboration" },
    { productName: "Dropbox Pro", description: "Priority support" },
    { productName: "Dropbox Pro", description: "Offline access to files" },

    // Google Workspace
    { productName: "Google Workspace", description: "Professional email with your domain" },
    { productName: "Google Workspace", description: "Collaborative tools like Docs, Sheets, and Slides" },
    { productName: "Google Workspace", description: "Cloud storage with Google Drive" },
    { productName: "Google Workspace", description: "Video conferencing with Meet" },

    // Notion Plus
    { productName: "Notion Plus", description: "Unlimited blocks for pages" },
    { productName: "Notion Plus", description: "Advanced permissions and sharing" },
    { productName: "Notion Plus", description: "Version history and recovery" },
    { productName: "Notion Plus", description: "API access for custom integrations" },

    // Evernote Pro
    { productName: "Evernote Pro", description: "Offline access to notes" },
    { productName: "Evernote Pro", description: "Advanced search capabilities" },
    { productName: "Evernote Pro", description: "Integration with third-party apps" },
    { productName: "Evernote Pro", description: "Notebooks with more than 250 notes" },

    // Figma Pro
    { productName: "Figma Pro", description: "Unlimited projects and files" },
    { productName: "Figma Pro", description: "Advanced prototyping features" },
    { productName: "Figma Pro", description: "Team libraries for design consistency" },
    { productName: "Figma Pro", description: "Version history and branching" },

    // EDX Pro
    { productName: "EDX Pro", description: "Access to professional education courses" },
    { productName: "EDX Pro", description: "Verified certificates for completed courses" },
    { productName: "EDX Pro", description: "MicroMasters and Professional Certificate programs" },

    { productName: "Zoom Pro", description: "Host unlimited meetings" },
    { productName: "Zoom Pro", description: "Up to 100 participants" },
    { productName: "Zoom Pro", description: "Cloud recording available" },
    { productName: "Zoom Pro", description: "Enhanced security features" },

    // YouTube Premium (Yearly)
    { productName: "Youtube Premium", description: "Ad-free videos" },
    { productName: "Youtube Premium", description: "Background play" },
    { productName: "Youtube Premium", description: "Offline downloads" },
    { productName: "Youtube Premium", description: "Access to YouTube Music" },

    // YouTube Premium (3 Months)
    { productName: "Youtube Premium", description: "Same benefits as yearly plan" },
    { productName: "Youtube Premium", description: "Limited-time discounted plan" },
    { productName: "Youtube Premium", description: "No interruptions while watching" },
    { productName: "Youtube Premium", description: "Exclusive content access" },

    // Arike Dating (3 Months)
    { productName: "Arike Dating", description: "Unlimited likes & matches" },
    { productName: "Arike Dating", description: "Priority message placement" },
    { productName: "Arike Dating", description: "See who viewed your profile" },
    { productName: "Arike Dating", description: "Exclusive profile boost feature" },

    // Arike Dating (6 Months)
    { productName: "Arike Dating", description: "Same benefits as 3-month plan" },
    { productName: "Arike Dating", description: "Discounted long-term plan" },
    { productName: "Arike Dating", description: "More visibility in match suggestions" },
    { productName: "Arike Dating", description: "Advanced match filtering" },

    // Pure Dating (Monthly)
    { productName: "Pure Dating", description: "No ads while swiping" },
    { productName: "Pure Dating", description: "Instant chat with new matches" },
    { productName: "Pure Dating", description: "Enhanced privacy mode" },
    { productName: "Pure Dating", description: "Verified user profiles" },

    // Mega Pro
    { productName: "Mega Pro", description: "Up to 200GB cloud storage" },
    { productName: "Mega Pro", description: "Encrypted secure storage" },
    { productName: "Mega Pro", description: "Fast file sharing & downloads" },
    { productName: "Mega Pro", description: "Collaboration tools included" },

    // DataCamp (3 Months)
    { productName: "Datacamp", description: "Full access to all courses" },
    { productName: "Datacamp", description: "Interactive coding exercises" },
    { productName: "Datacamp", description: "Track progress with quizzes" },
    { productName: "Datacamp", description: "Industry-recognized certificates" },

    // DataCamp (6 Months)
    { productName: "Datacamp", description: "Same benefits as 3-month plan" },
    { productName: "Datacamp", description: "Extended learning access" },
    { productName: "Datacamp", description: "More advanced career tracks" },
    { productName: "Datacamp", description: "Live mentoring sessions" },

    { productName: "Zee5 Premium", description: "Ad-free streaming experience" },
    { productName: "Zee5 Premium", description: "Access to exclusive original series" },
    { productName: "Zee5 Premium", description: "Watch premium movies & TV shows" },
    { productName: "Zee5 Premium", description: "Supports multiple devices & offline viewing" },

    // JioHotstar Premium
    { productName: "JioHotstar Premium", description: "Live sports streaming (Cricket, Football, etc.)" },
    { productName: "JioHotstar Premium", description: "Ad-free experience for premium content" },
    { productName: "JioHotstar Premium", description: "Exclusive Disney+ & Marvel content" },
    { productName: "JioHotstar Premium", description: "Supports UHD & Dolby Atmos sound" },
    { productName: "JioHotstar Premium", description: "Full 1 year access & activating on your mobile number" },
    
    { productName: "Microsoft Office 365", description: "Activating on your account" },
    { productName: "Microsoft Office 365", description: "Plan- MS 365 Personal" },
    { productName: "Microsoft Office 365", description: "Renew Also Available" },
    { productName: "Microsoft Office 365", description: "Private Subscription" },
    { productName: "Microsoft Office 365", description: "Source- Legit & Safe AF" },
    { productName: "Microsoft Office 365", description: "Guarantee- Till Plan's Validity" },

    { productName: "SonyLiv Premium", description: "Guarantee- Till Plan Expiry" },
    { productName: "SonyLiv Premium", description: "Activating on your Account" },

    { productName: "PCLOUD", description: "Fast file sharing & downloads" },
    { productName: "PCLOUD", description: "Collaboration tools included" },
    { productName: "PCLOUD", description: "Plan-Premium 500GB" },
    { productName: "PCLOUD", description: "Activating on your Account" },
    { productName: "PCLOUD", description: "Guarantee- Till Plan's Validity" },

    { productName: "Tinder Platinum", description: "No ads while swiping" },
    { productName: "Tinder Platinum", description: "Enhanced privacy mode" },
    { productName: "Tinder Platinum", description: "All Plans Available" },
    { productName: "Tinder Platinum", description: "Activating on your Account" },
    { productName: "Tinder Platinum", description: "Guarantee- Till Plan's Validity" },

    { productName: "Tinder Gold", description: "No ads while swiping" },
    { productName: "Tinder Gold", description: "Enhanced privacy mode" },
    { productName: "Tinder Gold", description: "All Plans Available" },
    { productName: "Tinder Gold", description: "Activating on your Account" },
    { productName: "Tinder Gold", description: "Guarantee- Till Plan's Validity" },

    { productName: "Quilbot Premium", description: "Advanced grammar and style checks" },
    { productName: "Quilbot Premium", description: "Plagiarism detection" },
    { productName: "Quilbot Premium", description: "Vocabulary enhancement suggestions" },
    { productName: "Quilbot Premium", description: "Integration with multiple platforms" },

    { productName: "Educative Premium", description: "Interactive coding challenges" },
    { productName: "Educative Premium", description: "Hands-on learning with real-world projects" },
    { productName: "Educative Premium", description: "Unlimited access to 500+ courses" },
    { productName: "Educative Premium", description: "Access to coding interview preparation paths" },
  
    // 📌 Leetcode Premium
    { productName: "Leetcode Premium", description: "Exclusive access to premium coding questions" },
    { productName: "Leetcode Premium", description: "In-depth solutions with step-by-step explanations" },
    { productName: "Leetcode Premium", description: "Real company interview questions" },
    { productName: "Leetcode Premium", description: "Mock interviews and contest problems" },
  
    // 📌 Codeacademy Pro
    { productName: "Codeacademy Pro", description: "Interactive coding lessons in multiple languages" },
    { productName: "Codeacademy Pro", description: "Personalized learning paths" },
    { productName: "Codeacademy Pro", description: "Project-based learning approach" },
    { productName: "Codeacademy Pro", description: "Certificates upon course completion" },
  
    // 📌 You.com
    { productName: "You.com", description: "Ad-free AI search experience" },
    { productName: "You.com", description: "AI-powered writing assistant" },
    { productName: "You.com", description: "Enhanced privacy with zero tracking" },
    { productName: "You.com", description: "Customizable AI models for better search results" }
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
