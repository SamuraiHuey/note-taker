const express = require('express');
const PORT = process.env.PORT || 3001;
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"))

app.get('/',  (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes',  (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes',  (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        res.json(JSON.parse(data))
    })
});

app.post('/api/notes', (req, res)  => {
    console.log(req.body)
    var title = req.body.title
    var text = req.body.text

    var newNote = {
        title,
        text,
        id: uuidv4()
    }

    fs.readFile('db/db.json', 'utf8', (err, data) => {
        var currentNotes = JSON.parse(data)
        currentNotes.push(newNote)
        fs.writeFile('db/db.json', JSON.stringify(currentNotes), (err)  => {
            err ? console.log(err) : console.log('New Note Saved')
        })
        res.sendFile(path.join(__dirname, '/public/notes.html'))
    })
})

app.delete('/api/notes/:id', (req, res) => {
    var clicked = req.params.id
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        var fileData = JSON.parse(data)
        var filterd = fileData.filter(note => note.id !== clicked)
        fs.writeFile('db/db.json', JSON.stringify(filterd), (err) => {
            err ? console.log(err) : console.log('Note Deleted')
        })
        res.sendFile(path.join(__dirname, '/public/notes.html'))
    })
})

app.listen(PORT, function () {
    console.log("App listening on port http://localhost:" + PORT)
})