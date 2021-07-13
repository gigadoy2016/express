const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');


const port = 3000;

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.set('view engine', 'ejs');
app.set('views', './views');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

//Upload route
app.post('/upload', upload.single('image'), (req, res, next) => {
    try {
        return res.status(201).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        console.error(error);
    }
});
app.get('/new', (req, res) => {
    res.render('upload');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));