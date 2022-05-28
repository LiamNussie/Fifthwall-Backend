require("dotenv").config();
const express = require("express");
const cors = require("cors")
const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then((db) => console.log(`MongoDB Connected: ${db.connection.host}`))
  .catch((err) => console.log(`MongoDB Connection Failed: ${err.message}`));

  const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  };

const projectSchema = new mongoose.Schema({
  bannerImg: String,
  thumbImg: String,
  name: String,
  about: [String],
  client: String,
  location: String,
  services: [String],
  gallery: [String],
  half: [String],
  tiled: [String],
  video: [String]
}, schemaOptions);

const Project = mongoose.model("Project", projectSchema);

app.get("/projects", async (req, res) => {
  const projects = await Project.find({});

  res.status(200).send(projects);
});

app.get("/projects/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).send({ message: "Project not found" });
  }

  res.status(200).send(project);
});

app.delete("/projects/:id", async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).send({ message: "Project not found" });
  }

  res.status(204).send({});
});

app.post("/projects", async (req, res) => {
  const project = await Project.create(req.body);

  res.status(201).send({message: "Project Created Successfully!", project: project});
});

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Something went wrong!')
})

const port = process.env.PORT || 3007;
const server = app.listen(port, () => console.log(`Server listening on port ${port}`));

process.on('unhandledRejection', (err) => {
  console.error(err)
  server.close(() => process.exit(1))
})

process.on('SIGTERM', (err) => {
  server.close(() => console.log('SIGTERM received. Process terminated'))
})
