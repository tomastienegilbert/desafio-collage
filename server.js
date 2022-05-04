const express = require('express');
const chalk = require('chalk');
//Integrar express-fileupload a Express. (1 Punto)
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');

app.listen(3000, () => {
    console.log(chalk.green.bold('Servidor en 3000'));
});

//get formularop
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/formulario.html');
});

//get collage
// Ruta GET "/collage"
app.get("/collage", (req, res) => {
    res.sendFile(__dirname + '/public/collage.html')

})

// publicar carpetas
app.use(express.static("public"));

//file upload conig
app.use(fileUpload(
    {
        //Definir que el límite para la carga de imágenes es de 5MB. (2 Puntos)
        limits: { fileSize: 5000000000 },
        abortOnLimit: true,
        //Responder con un mensaje indicando que se sobrepasó el límite especificado. (2 Puntos)
        responseOnLimit: 'El archivo supera el tamaño permitido',
        createParentPath: true
    }
));

//Crear una ruta POST /imagen que reciba y almacene una imagen en una carpeta pública del servidor. Considerar que el formulario envía un payload con una propiedad “position”, que indica la posición del collage donde se deberá mostrar la imagen. (3 Puntos)
app.post('/imagen', (req, res) => {
    const { target_file } = req.files;
    const { posicion } = req.body;
    target_file.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, (err) => {
        try {
            if (err) { throw e }
            console.log('Archivo subido exitosamente');
            res.redirect('/collage');
        } catch (error) {
            res.send(error);
        }
    });
});

//Crear una ruta DELETE /imagen/:nombre que reciba como parámetro el nombre de una imagen y la elimine de la carpeta en donde están siendo alojadas las imágenes. Considerar que esta interacción se ejecuta al hacer click en alguno de los números del collage. (2 Puntos)
app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
        try {
            if (err) { throw e }
            console.log('Imagen borrada exitosamente')
        res.redirect("/collage")
        } catch (error) {
            res.send(error);
        }
    });
});