import fs from "fs";
import util from "util";
import UglifyJS from "uglify-js";
import { themeConfig } from "../../lib/theme";
const args = process.argv.slice(2);
const documentPath = "./pages/_document.tsx";
const scriptFileName = "script.js";
const scriptVariableName = "themeScript";
const scriptPath = `./.theme/build/${scriptFileName}`;
// use webpack to output logic of read theme.ts and write _document.tsx as index
// use node to read index and output scriptfile
// use node to read scriptfile and inject script into _document.tsx
const scriptContent = `(function () {
  var currentTheme;

  function changeTheme(inputTheme) {
    if (inputTheme === "dark") {
      var theme = themeConfig.dark;
      for (var key in theme) {
        setCSSVar(key, theme[key]);
      }
      localStorage.setItem("theme", inputTheme);
    } else {
      var theme = themeConfig.light;
      for (var key in theme) {
        setCSSVar(key, theme[key]);
      }
      localStorage.setItem("theme", inputTheme);
    }
  }

  function setCSSVar(property, color) {
    document.documentElement.style.setProperty(property, color);
  }

  try {
    currentTheme = localStorage.getItem("theme") || "light";

    var themeConfig = ${util.inspect(themeConfig, {
      showHidden: false,
      depth: null,
    })};

    changeTheme(currentTheme);
  } catch (err) {
    console.log(err);
  }
})();
`;

const editDocument = () => {
  const data = fs.readFileSync(scriptPath, "utf-8");

  readWriteDocumentSync(data);
};

const readWriteDocumentSync = (scriptData: string) => {
  const documentData = fs.readFileSync(documentPath, "utf-8");
  scriptData = `/**theme script start**/
const ${scriptVariableName} =  \`${scriptData}\`
/**theme script end**/`;

  // .* greedy character doesn't match newline so using [^]+
  // [^]+ Which means ‘don’t match no characters’, a double negative that can re-read as ‘match any character’
  const newDocumentData = documentData.replace(
    /\/\*\*\s*theme script start\s*\*\*\/[^]+\/\*\*\s*theme script end\s*\*\*\//,
    scriptData
  );
  // console.log(newDocumentData);

  fs.writeFileSync(documentPath, newDocumentData, "utf-8");
};

const run = () => {
  switch (args[0]) {
    case "--build-script-file":
      fs.appendFileSync(
        scriptPath,
        UglifyJS.minify(scriptContent, { mangle: { toplevel: true } }).code
      );
      break;
    case "--edit-document":
      editDocument();
      break;
  }
};

run();
