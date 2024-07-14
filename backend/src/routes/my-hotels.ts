import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middlewares/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is Required"),
    body("city").notEmpty().withMessage("City is Required"),
    body("country").notEmpty().withMessage("Country is Required"),
    body("description").notEmpty().withMessage("Description is Required"),
    body("type").notEmpty().withMessage("Type is Required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price Per Night is Required"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are Required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const uploadPromises = imageFiles.map(async (img) => {
        const b64 = Buffer.from(img.buffer).toString("base64");
        let dataURI = "data:" + img.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      const imageUrls = await Promise.all(uploadPromises);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = String(req.userId);

      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel);
    } catch (error) {
      console.log("Error creating Hotel: ", error);
      res.status(500).json({ message: `Something went wrong: ${error}` });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Hotels" });
  }
});

export default router;
