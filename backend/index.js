const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const requestLogger = (req, res, next) => {
  console.log("Method: ", req.method);
  console.log("path: ", req.path);
  console.log("Body: ", req.body);
  console.log("---");
  next();
};

app.use(requestLogger);

let notes = [
  {
    id: "1",
    content: "HTML is easy from back end",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

// All notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// Single note
app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);
  if (!note) {
    res.status(404).end();
  }
  res.json(note);
});

// generate ID
const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;

  return String(maxId + 1);
};

//create note
app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    console.log("here");
    return res.status(400).json({ error: "content missing" });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);
  res.json(note);
});

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log("server is runnning...");
});
