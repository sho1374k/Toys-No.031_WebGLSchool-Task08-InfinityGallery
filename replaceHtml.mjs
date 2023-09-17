import { writeFileSync, readFileSync } from "fs";
import glob from "glob";

const replaceInHtmlFiles = () => {
  try {
    const files = glob.sync("dist/**/*.html");
    console.log(files);
    for (const file of files) {
      // htmlファイルの読み込み
      const data = readFileSync(file, "utf8");

      // htmlの置かれているパスから相対(., ..)を算出
      let relativePath = file.replace(/[^/]/g, "").replace(/\//g, ".");

      if (relativePath.length === 1) {
        relativePath = file.replace(/[^/]/g, "").replace(/\//g, ".");
      } else {
        relativePath = file.replace(/[^/]/g, "").replace(/\//g, "../");
        relativePath = relativePath.slice(0, -1);
        // 3 ... | ../../ → ../..
        // 4 .... | ../../../ → ../../..
        // 5 ..... | ../../../../ → ../../../..
      }

      // href, srcに指定されている絶対パスを置換
      const result = data
        .replace(/href="\//g, `href="${relativePath}/`)
        .replace(/href='\//g, `href='${relativePath}/`)
        .replace(/src="\//g, `src="${relativePath}/`)
        .replace(/src='\//g, `src='${relativePath}/`)
        .replace(/srcset="\//g, `srcset="${relativePath}/`)
        .replace(/srcset='\//g, `srcset='${relativePath}/`)
        .replace(/action="\//g, `action="${relativePath}/`)
        .replace(/action='\//g, `action='${relativePath}/`)
        .replace(/content="\//g, `content="${relativePath}/`)
        .replace(/content='\//g, `content='${relativePath}/`);

      writeFileSync(file, result, "utf8");
      // console.log(file);
    }
    console.log(`\n// --------------------------\n\n👌 ~ replaceInHtmlFiles\n\n// --------------------------\n`);
  } catch (error) {
    console.log(
      `\n// -------------------------- \n\n🙅‍♀️ ~ replaceInHtmlFiles\n\n// --------------------------\n${error}\n`,
    );
  }
};

replaceInHtmlFiles();
// node replaceHtml.mjs
