import sharp from "sharp";

sharp("../uploads/1775150323761-IMG_7974.heic")
  .metadata()
  .then(console.log)
  .catch(console.error);