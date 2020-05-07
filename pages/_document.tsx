import Document, { Html, Head, Main, NextScript } from "next/document";

/**theme script start**/
const themeScript =  `!function(){var e;function c(e,o){document.documentElement.style.setProperty(e,o)}try{e=localStorage.getItem("theme")||"light";var r={"--color-homepage-bg":"#0e141b","--color-text":"#fff","--code":"#ccc","--color-blue":"#f300e0","--color-grey":"#ccc"},l={"--color-homepage-bg":"#fff","--color-text":"#000","--code":"#f1f1f1","--color-blue":"#0070f3","--color-grey":"#eaeaea"};!function(e){if("dark"===e){var o=r;for(var t in o)c(t,o[t]);localStorage.setItem("theme",e)}else{o=l;for(var t in o)c(t,o[t]);localStorage.setItem("theme",e)}}(e)}catch(e){console.log(e)}}();`
/**theme script end**/

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </Head>
        <body>
          {/* some sources placed script inside body, before Main, but I experienced flashing */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
