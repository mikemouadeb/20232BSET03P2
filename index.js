const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE cats (id INTEGER PRIMARY KEY, name TEXT, votes INT)");
  db.run("CREATE TABLE dogs (id INTEGER PRIMARY KEY, name TEXT, votes INT)");
});

function insertAnimal(res, animalType, name) {
  const stmt = db.prepare(`INSERT INTO ${animalType} (name, votes) VALUES (?, 0)`);
  stmt.run(name, function (err) {
    if (err) {
      res.status(500).send("Erro ao inserir no banco de dados");
    } else {
      res.status(201).json({ id: this.lastID, name, votes: 0 });
    }
  });
  stmt.finalize();
}

app.post('/cats', (req, res) => {
  const name = req.body.name;
  insertAnimal(res, 'cats', name);
});

app.post('/dogs', (req, res) => {
  const name = req.body.name;
  insertAnimal(res, 'dogs', name);
});

app.post('/vote/:animalType/:id', (req, res) => {
  const { animalType, id } = req.params;
  if (animalType !== 'cats' && animalType !== 'dogs') {
    return res.status(400).send('Tipo de animal inválido');
  }

  db.get(`SELECT * FROM ${animalType} WHERE id = ?`, id, (err, row) => {
    if (err) {
      return res.status(500).send('Erro ao consultar o banco de dados');
    }

    if (!row) {
      return res.status(404).send('Animal não encontrado');
    }

    db.run(`UPDATE ${animalType} SET votes = votes + 1 WHERE id = ?`, id, (updateErr) => {
      if (updateErr) {
        return res.status(500).send('Erro ao atualizar o banco de dados');
      }
      res.status(200).send('Voto computado');
    });
  });
});

app.get('/cats', (req, res) => {
  db.all("SELECT * FROM cats", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});

app.get('/dogs', (req, res) => {
  db.all("SELECT * FROM dogs", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocorreu um erro!');
});

app.listen(port, () => {
  console.log(`Cats and Dogs Vote app listening at http://localhost:${port}`);
});
