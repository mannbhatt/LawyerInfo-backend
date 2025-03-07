require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema & Model
const InstitutionSchema = new mongoose.Schema({ name: String });
const Institution = mongoose.model("Institution", InstitutionSchema);

// Institution Data (Add More as Needed)
const institution = [
  { name: "National Law School of India University (NLSIU), Bangalore" },
  { name: "National Academy of Legal Studies and Research (NALSAR), Hyderabad" },
  { name: "The West Bengal National University of Juridical Sciences (WBNUJS), Kolkata" },
  { name: "National Law University (NLU), Delhi" },
  { name: "National Law University, Jodhpur" },
  { name: "Gujarat National Law University (GNLU), Gandhinagar" },
  { name: "Rajiv Gandhi National University of Law (RGNUL), Punjab" },
  { name: "Dr. Ram Manohar Lohiya National Law University (RMLNLU), Lucknow" },
  { name: "Hidayatullah National Law University (HNLU), Raipur" },
  { name: "Chanakya National Law University (CNLU), Patna" },
  { name: "National Law University, Odisha (NLUO)" },
  { name: "Maharashtra National Law University (MNLU), Mumbai" },
  { name: "Maharashtra National Law University (MNLU), Nagpur" },
  { name: "Maharashtra National Law University (MNLU), Aurangabad" },
  { name: "Tamil Nadu National Law University (TNNLU), Tiruchirappalli" },
  { name: "Damodaram Sanjivayya National Law University (DSNLU), Visakhapatnam" },
  { name: "Himachal Pradesh National Law University (HPNLU), Shimla" },
  { name: "Dharmashastra National Law University (DNLU), Jabalpur" },
  { name: "National Law University and Judicial Academy (NLUJA), Assam" },
  { name: "Faculty of Law, University of Delhi (DU)" },
  { name: "Banaras Hindu University (BHU), Varanasi - Faculty of Law" },
  { name: "Aligarh Muslim University (AMU), Aligarh - Faculty of Law" },
  { name: "Symbiosis Law School (SLS), Pune" },
  { name: "Symbiosis Law School (SLS), Noida" },
  { name: "Symbiosis Law School (SLS), Hyderabad" },
  { name: "Symbiosis Law School (SLS), Nagpur" },
  { name: "Jindal Global Law School (JGLS), Sonipat" },
  { name: "Amity Law School, Noida" },
  { name: "ICFAI Law School, Hyderabad" },
  { name: "Government Law College (GLC), Mumbai" },
  { name: "ILS Law College, Pune" },
  { name: "Christ University - School of Law, Bangalore" },
  { name: "School of Law, UPES, Dehradun" },
  { name: "Lovely Professional University (LPU) - School of Law, Punjab" },
  { name: "Alliance University - School of Law, Bangalore" },
  { name: "Bharati Vidyapeeth New Law College, Pune" },
  { name: "Guru Gobind Singh Indraprastha University (GGSIPU) - University School of Law and Legal Studies (USLLS), Delhi" },
  { name: "Dr. Ambedkar Government Law College, Chennai" },
  { name: "KLE Society’s Law College, Bangalore" },
  { name: "VIT School of Law, Chennai" },
  { name: "The NorthCap University - School of Law, Gurgaon" },
  { name: "Sastra University - School of Law, Thanjavur" },
  { name: "M.S. Ramaiah College of Law, Bangalore" },
  { name: "ICFAI Law School, Dehradun" },
  { name: "Institute of Law, Nirma University, Ahmedabad" },
  { name: "Asian Law College (ALC), Noida" },
  { name: "Rajiv Gandhi School of Intellectual Property Law, IIT Kharagpur" },
  { name: "Maharishi Law School, Maharishi University, Noida" },
  { name: "Manav Rachna University - Faculty of Law, Faridabad" },
  { name: "Reva University - School of Legal Studies, Bangalore" },
  { name: "New Law College, Bharati Vidyapeeth, Pune" },
  { name: "ICFAI Law School, Jaipur" },
  { name: "IMS Law College, Noida" },
  { name: "MIT-WPU School of Law, Pune" },
  { name: "School of Law, Presidency University, Bangalore" },
  { name: "IFIM Law School, Bangalore" },
  { name: "UPES School of Law, Dehradun" },
  { name: "Indore Institute of Law (IIL), Indore" },
  { name: "Siddhartha Law College, Dehradun" },
  { name: "Mar Gregorios College of Law, Thiruvananthapuram" },
  { name: "ISBR Law College, Bangalore" },
  { name: "Geeta Institute of Law, Panipat" },
  { name: "Bennett University - School of Law, Greater Noida" },
  { name: "ICFAI Law School, Ranchi" },
  { name: "Maharaja Agrasen Institute of Management Studies (MAIMS) - School of Law, Delhi" },
  { name: "CMR University - School of Legal Studies, Bangalore" },
  { name: "Amity Law School, Lucknow" },
  { name: "School of Law, Manipal University, Jaipur" },
  { name: "School of Law, Galgotias University, Greater Noida" },
  { name: "Vivekananda Institute of Professional Studies (VIPS), Delhi" },
  { name: "Sharda University - School of Law, Greater Noida" },
  { name: "Law College Dehradun, Uttaranchal University" },
  { name: "Dr. DY Patil Law College, Pune" },
  { name: "Parul University - Faculty of Law, Vadodara" },
  { name: "BML Munjal University - School of Law, Gurgaon" },
  { name: "GITAM School of Law, Visakhapatnam" },
  { name: "DNLU Jabalpur (Dharmashastra National Law University)" },
  { name: "Jayoti Vidyapeeth Women's University - School of Law, Jaipur" },
  { name: "Asian College of Law, Dehradun" },
  { name: "Bharti Vidyapeeth University New Law College, Sangli" },
  { name: "Shivaji University - Department of Law, Kolhapur" },
  { name: "Apeejay Stya University - School of Legal Studies, Gurugram" },
  { name: "Narsee Monjee Institute of Management Studies (NMIMS) - School of Law, Mumbai" },
  { name: "Amity Law School, Jaipur" },
  { name: "GL Bajaj Institute of Management and Research - School of Law, Greater Noida" },
  { name: "MIT Law School, Pune" },
  { name: "Adamas University - School of Law and Justice, Kolkata" },
  { name: "Ansal University - School of Law, Gurgaon" },
  { name: "Lovely Professional University (LPU) - School of Law, Punjab" },
  { name: "Graphic Era University - School of Law, Dehradun" },
  { name: "KIIT Law School, Bhubaneswar" }];
// Insert Data into MongoDB
const institutions = Array.from(new Map(institution.map(inst => [inst.name, inst])).values());

console.log(`✅ Unique institutions count: ${institutions.length}`);

// ✅ Function to Insert Data Safely
const insertData = async () => {
  try {
    for (let inst of institutions) {
      // **Check if institution already exists**
      const exists = await Institution.findOne({ name: inst.name });

      if (!exists) {
        await Institution.create(inst);
        console.log(`✅ Inserted: ${inst.name}`);
      } else {
        console.log(`⚠️ Skipping (Already Exists): ${inst.name}`);
      }
    }

    console.log("🎉 Data insertion completed!");
  } catch (error) {
    console.error("❌ Error inserting institutions:", error);
  } finally {
    mongoose.connection.close();
  }
};

// ✅ Run the function
insertData();
