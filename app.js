import Express from "express";
import multer from "multer";
import path from "path";
import jwt from 'jsonwebtoken';
import {
  signUp,
  updateName,
  updatePhoneNumber,
  getUserName,
  insertImageURL,
  Login,
  getUserData,
  getProfilePhoto,
  editImageProfile,
  editImageBanner,
  addLinks,
  getLinksWithColumnNames,
  createName,
  updateParraf,
  deleteImages,
  editLinks,
  editTesteo
} from "./database.js";
import cors from "cors";
import bcrypt from "bcryptjs"
import fs from 'fs/promises'

const corsOptions = {
  origin: "*",
  methods: ["POST", "GET"],
  credentials: true
}
const app = Express();
app.use(Express.json());
app.use(cors(corsOptions))
app.use(Express.static(path.join('public')))

const secretKey = 'abcdefghijk';

const diskStorage = multer.diskStorage({
  destination: path.join('public/images'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  }
})

const filesUploaded = multer({
  storage: diskStorage,
}).single('image')

app.post('/edit-profile-image', filesUploaded, async (req, res) => {
  try {
    const fileLocation = req.file.path; // Ubicación del archivo en el servidor
    const email = req.body.email;
    console.log(req.file)
    const fileLocationWithoutPublic = fileLocation.replace('\public', '');
    await editImageProfile(email, fileLocationWithoutPublic);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while registering user" });
  }
})

app.post('/edit-image', filesUploaded, async (req, res) => {
  try {
    const fileLocation = req.file.path; // Ubicación del archivo en el servidor
    const email = req.body.email;
    console.log(req.file)
    const fileLocationWithoutPublic = fileLocation.replace('\public', '');
    await editImageBanner(email, fileLocationWithoutPublic);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while registering user" });
  }
})

app.post('/upload-image', filesUploaded, async (req, res) => {
  try {
    const fileLocation = req.file.path; // Ubicación del archivo en el servidor
    const userId = req.body.userId;
    console.log(req.file)
    const fileLocationWithoutPublic = fileLocation.replace('\public', '');
    await insertImageURL(userId, fileLocationWithoutPublic);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while registering user" });
  }
})

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const cryptPass = await bcrypt.hash(password, 10)
    const result = await signUp(email, cryptPass);
    const user = {
      id: result, // Supongamos que result contiene el ID del usuario registrado
      email: email // Puedes agregar más información aquí si lo necesitas
    };

    const token = jwt.sign(user, secretKey);

    res.status(201).json({ message: "User registered successfully", user_id: result, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while registering user" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Login(email, password);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    const dbPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, dbPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign(user, secretKey);

    res.status(200).json({ message: "Inicio de sesión exitoso", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});


app.post("/update-name", async (req, res) => {
  try {
    const { insertId, name } = req.body; // Obtén el user_id y el nombre del cuerpo de la solicitud
    const result = await createName(insertId, name);
    res.status(201).json({ message: "Name updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating name" });
  }
});

app.put("/updateName", async (req, res) => {
  try {
    const { editName, idUser } = req.body;
    const result = await updateName(editName, idUser);

    if (result.success) {
      res.status(201).json({ message: "Name updated successfully" });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating name" });
  }
});

app.put("/updateDescription", async (req, res) => {
  try {
    const { editParraf, idUser } = req.body;
    const result = await updateParraf(editParraf, idUser);

    if (result.success) {
      res.status(201).json({ message: "Name updated successfully" });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error en el manejador de rutas al actualizar la descripción:', error);
    res.status(500).json({ error: 'An error occurred while updating description' });
  }

});

app.post("/update-number", async (req, res) => {
  try {
    const { insertId, number} = req.body;
    const fullPhoneNumber = `tel:+57${number}`;
    const fullWhatsapp = `https://wa.me/57${number}`
    const result = await updatePhoneNumber(insertId, fullPhoneNumber, fullWhatsapp);
    res.status(200).json({ message: "Phone number updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating phone number" });
  }
});

app.get("/get-name/:insertId", async (req, res) => {
  try {
    const insertId = req.params.insertId;
    const name = await getUserName(insertId);

    if (name) {
      res.status(200).json({ name });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user's name:", error);
    res.status(500).json({ error: "An error occurred while fetching user's name" });
  }
});

app.get("/get-data/:email", async (req, res) => {
  try {
    const email = req.params.email;
    // Realiza alguna operación para obtener los datos del usuario basados en el correo electrónico
    const userData = await getUserData(email);

    if (userData) {
      res.status(200).json(userData);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "An error occurred while fetching user data" });
  }
});

app.get("/profileImage/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const photo = await getProfilePhoto(email);

    if (photo) {
      res.status(200).json({ photo });
    } else {
      res.status(404).json({ error: "picture not found" });
    }
  } catch (error) {
    console.error("Error fetching user's name:", error);
    res.status(500).json({ error: "An error occurred while fetching user's name" });
  }
});

app.post("/links", async (req, res) => {
  try {
    const { selectedTextValue, userInput, storedIdNumber } = req.body;
    console.log(`${selectedTextValue} ${userInput} ${storedIdNumber}`)
    const result = await addLinks(selectedTextValue, userInput, storedIdNumber);
    console.log('Resultado de la inserción:', result);
    res.status(201).json({ message: "Link actualizado exitosamente", result });
  } catch (error) {
    console.error("Error en la ruta POST /links:", error);
    res.status(500).json({ error: error.message });
  }
})

app.get('/obtenerUsuario/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const links = await getLinksWithColumnNames(userId)
    if (links) {
      res.status(200).json({ links });
    } else {
      res.status(404).json({ error: "picture not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }

})

app.delete('/deleteImage', async (req, res) => {
  try {
    const imagePath = req.body.urlPath; // Ruta relativa de la imagen
    const imageType = req.body.imageType; // Tipo de imagen (puede ser 'profilePhoto' o 'banner')

    console.log('Ruta de la imagen:', imagePath);
    console.log('Tipo de imagen:', imageType);

    // Elimina la imagen del sistema de archivos
    await fs.unlink(`public\\${imagePath}`);

    const result = await deleteImages(imagePath, imageType);
    console.log('Resultado de la eliminación:', result);

    // Envía una respuesta de éxito
    res.status(200).json({ message: 'Imagen eliminada con éxito', result });
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
});

app.post('/editLinks', async (req, res) => {
  try {
    const {storedIdNumber, editLink, selectedTextValue} = req.body
    const response = await editLinks(storedIdNumber, editLink, selectedTextValue);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error edit links:", error);
    res.status(500).json({ error: "An error occurred while edit links" });
  }
})

app.post('/testeo', filesUploaded, async (req, res) => {
  try {
    const fileLocation = req.file.path; // Ubicación del archivo en el servidor
    const email = req.body.email;
    console.log(req.file)
    const fileLocationWithoutPublic = fileLocation.replace('\public', '');
    await editTesteo(email, fileLocationWithoutPublic);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while registering user" });
  }
})

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

