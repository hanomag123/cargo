import fs from "fs-extra";

const srcDir = "./src/icons";
const distDir = "./src/icons.json";

async function getIcons() {
  try {
    await fs.readdir(srcDir, (err, files) => {
      if (err) {
        throw new Error(err);
      }

      const result = [];

      files.forEach((i) => {
        const nameArr = i.split(".svg");
        if (
          nameArr[0] &&
          !nameArr[0].includes(".DS_Store") &&
          !nameArr[0].includes(".gitkeep")
        ) {
          result.push(nameArr[0]);
        }
      });

      writeIcons(result);
    });
  } catch (err) {
    console.error("Ошибка при копировании файлов:", err);
  }
}

async function writeIcons(data) {
  try {
    await fs.writeJson(distDir, data);
  } catch (e) {}
}

getIcons();
