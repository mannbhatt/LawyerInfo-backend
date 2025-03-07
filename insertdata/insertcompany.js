require("dotenv").config(); // Load environment variables

const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema & Model
const CompanySchema = new mongoose.Schema({ name: String });

const Company = mongoose.model("Company", CompanySchema);

// 📌 List of Top 1000 Companies in India
const companies = [
  
  { name: "Supreme Court of India" },
  { name: "Delhi High Court" },
  { name: "Bombay High Court" },
  { name: "Kolkata High Court" },
  { name: "Madras High Court" },
  { name: "Allahabad High Court" },
  { name: "Bangalore High Court" },
  { name: "Chennai District Court" },
  { name: "Hyderabad District Court" },
  { name: "National Legal Services Authority (NALSA)" },
  { name: "State Legal Services Authorities" },
  { name: "All India Bar Examination (AIBE)" },
  { name: "Bar Council of India" },
  { name: "Bar Council of Maharashtra and Goa" },
  { name: "Bar Council of Delhi" },
  { name: "Indian Bar Association (IBA)" },
  { name: "Indian National Bar Association (INBA)" },
  { name: "Supreme Court Bar Association (SCBA)" },
  { name: "Advocate General's Office" },
  { name: "Law Commission of India" },
  { name: "Ministry of Law and Justice, Government of India" },
  { name: "Central Bureau of Investigation (CBI)" },
  { name: "Directorate of Prosecution" },
  { name: "Income Tax Appellate Tribunal (ITAT)" },
  { name: "National Company Law Tribunal (NCLT)" },
  { name: "National Consumer Disputes Redressal Commission (NCDRC)" },
  { name: "Central Administrative Tribunal (CAT)" },
  { name: "National Human Rights Commission (NHRC)" },
  { name: "National Investigation Agency (NIA)" },
  { name: "Law Officers' Institute" },
  { name: "Indian Lawyers Association" },
  { name: "International Bar Association (IBA)" },
  { name: "British Bar Association" },
  { name: "Federation of Indian Bar" },
  { name: "Vidhikarya" },
  { name: "IndusLaw" },
  { name: "Khaitan & Co." },
  { name: "AZB & Partners" },
  { name: "J. Sagar Associates (JSA)" },
  { name: "Cyril Amarchand Mangaldas" },
  { name: "Luthra & Luthra Law Offices" },
  { name: "Shardul Amarchand Mangaldas & Co." },
  { name: "S&R Associates" },
  { name: "Trilegal" },
  { name: "Baker McKenzie" },
  { name: "Dua Associates" },
  { name: "Rajani Associates" },
  { name: "Amarchand & Mangaldas & Suresh A Shroff & Co." },
  { name: "L&L Partners" },
  { name: "Khaitan & Co. LLP" },
  { name: "Bharucha & Partners" },
  { name: "Karanjawala & Co." },
  { name: "Seth Dua & Associates" },
  { name: "P&A Law Offices" },
  { name: "Tuli & Co." },
  { name: "SINGHANIA & PARTNERS LLP" },
  { name: "Sirius Legal" },
  { name: "V & A Law Offices" },
  { name: "Anand and Anand" },
  { name: "Mulla & Mulla & Craigie Blunt & Caroe" },
  { name: "Ramjit & Co." },
  { name: "Jethmalani & Co." },
  { name: "Chambers of V K Nair" },
  { name: "Kochhar & Co." },
  { name: "Nishith Desai Associates" },
  { name: "Tata Consultancy Services - Legal Team" },
  { name: "HCL Technologies - Legal Team" },
  { name: "Tech Mahindra - Legal Team" },
  { name: "Wipro - Legal Department" },
  { name: "Bajaj Auto - Legal Department" },
  { name: "Mahindra & Mahindra - Legal Department" },
  { name: "Flipkart - Legal Team" },
  { name: "Amazon - Legal Department" },
  { name: "Microsoft India - Legal Team" },
  { name: "Google India - Legal Department" },
  { name: "Apple India - Legal Team" },
  { name: "IBM India - Legal Department" },
  { name: "Accenture - Legal Team" },
  { name: "Cognizant Technology Solutions - Legal Team" },
  { name: "Smartron India - Legal Team" },
  { name: "Reliance Jio - Legal Team" },
  { name: "Larsen & Toubro - Legal Department" },
  { name: "ONGC - Legal Department" },
  { name: "Indian Oil Corporation Ltd - Legal Team" },
  { name: "Bharat Petroleum Corporation Ltd (BPCL) - Legal Team" },
  { name: "Tata Steel - Legal Team" },
  { name: "SBI - Legal Department" },
  { name: "Bank of Baroda - Legal Team" },
  { name: "Axis Bank - Legal Department" },
  { name: "ICICI Bank - Legal Team" },
  { name: "HDFC Bank - Legal Team" },
  { name: "ICICI Prudential - Legal Team" },
  { name: "Standard Chartered Bank - Legal Department" },
  { name: "HSBC India - Legal Team" },
  { name: "India Post - Legal Department" },
  { name: "National Bank for Agriculture and Rural Development (NABARD) - Legal Team" },
  { name: "Reserve Bank of India - Legal Team" },
  { name: "SEBI - Legal Team" },
  { name: "IRDAI - Legal Team" },
  { name: "RBI - Legal Team" },
  { name: "Central Bureau of Investigation (CBI) - Legal Team" },
  { name: "Central Vigilance Commission (CVC) - Legal Department" },
  { name: "National Investigation Agency (NIA) - Legal Team" },
  { name: "Directorate General of Civil Aviation (DGCA) - Legal Team" },
  { name: "Directorate General of Foreign Trade (DGFT) - Legal Department" },
  { name: "Indian Telecom Regulatory Authority (TRAI) - Legal Team" },
  { name: "Department of Justice - Legal Affairs" },
  { name: "Nuclear Power Corporation of India Limited (NPCIL) - Legal Team" },
  { name: "Coal India Limited (CIL) - Legal Department" },
  { name: "Oil and Natural Gas Corporation (ONGC) - Legal Department" },
  { name: "Central Board of Excise and Customs (CBEC) - Legal Team" },
  { name: "Indian Revenue Service (IRS) - Legal Team" }



];

// Insert Data into MongoDB
const insertData = async () => {
  try {
    await Company.deleteMany(); // Optional: Clears existing data
    await Company.insertMany(companies); // Insert companies
    console.log("✅ Companies inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting companies:", error);
  } finally {
    mongoose.connection.close(); // Close connection
  }
};

// Run the function
insertData();
