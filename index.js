require('dotenv').config();
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const mongoose = require('mongoose');
const { cors } = require('hono/cors');
const authRoutes=require('./routes/auth')
//const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const educationRoutes = require('./routes/education');
const experienceRoutes = require('./routes/experience');
const aboutRoutes=require('./routes/about');
const achievements=require('./routes/achievements');
const skills=require('./routes/skills');
const socialLink=require('./routes/socialLink');
const contribution=require('./routes/contribution');
const institution = require("./routes/institution");
const company = require("./routes/company");
const profileData=require("./routes/profilesdata");
const app = new Hono();
app.use(cors({
  origin: "*",
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.route('/api/auth', authRoutes);
//app.route('/users', userRoutes);
app.route('/profiles', profileRoutes);
app.route('/education', educationRoutes);
app.route('/experience', experienceRoutes);
app.route('/about',aboutRoutes);
app.route('/achievements',achievements);
app.route('/skills',skills);
app.route('/socialLink',socialLink);
app.route('/contribution',contribution);
app.route("/institutions", institution);
app.route("/companies", company);
app.route("/profiledata",profileData);
app.get('/', (c) => c.text('Welcome to Lawyer Info API 🚀'));

serve({
  fetch: app.fetch,
  port: 5000,
});

console.info("🚀 Server running on http://localhost:5000");