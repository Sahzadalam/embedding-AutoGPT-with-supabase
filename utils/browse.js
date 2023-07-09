const cheerio = require("cheerio");
const { WordTokenizer, PorterStemmer } = require("natural");
const stopwords = require("stopword");

const fetchContent = async (url) => {
  const response = await fetch(`${url}`);
  const html = await response.text();
  return html;
};

const extractText = (html) => {
  const $ = cheerio.load(html);
  const allText = $("body").text();

  return allText ?? "";
};

const extractLinks = (html) => {
  const $ = cheerio.load(html);
  const allText = $("body").text();
  const links = allText.querySelectorAll("a");
  return Array.from(links).map((link) => ({
    text: link.textContent?.trim(),
    link: link.getAttribute("href"),
  }));
};

const splitText = (text, maxLength = 8192) => {
  const paragraphs = text.split("\n");
  let currentLength = 0;
  let currentChunk = [];
  const result = [];

  for (let paragraph of paragraphs) {
    paragraph = paragraph.trim();
    if (currentLength + paragraph.length + 1 <= maxLength) {
      currentChunk.push(paragraph);
      currentLength += paragraph.length + 1;
    } else {
      result.push(currentChunk.join("\n"));
      currentChunk = [paragraph];
      currentLength = paragraph.length + 1;
    }
  }

  if (currentChunk.length > 0) {
    result.push(currentChunk.join("\n"));
  }

  return result;
};

const preprocessText = async (text) => {
  // Remove JavaScript code snippets
  const withoutJSCode = text.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  const withoutHTMLTags = withoutJSCode.replace(/<\/?[^>]+(>|$)/g, "");

  // Remove extra spaces and line changes
  const withoutExtraSpaces = withoutHTMLTags.replace(/\s+/g, " ").trim();

  // Convert to lowercase
  const lowercaseText = withoutExtraSpaces.toLowerCase();

  // Remove stopwords and single words
  const tokens = lowercaseText.split(" ");
  const filteredTokensWithoutStopwords = stopwords.removeStopwords(tokens);
  const filteredTokens = filteredTokensWithoutStopwords.filter(
    (token) => token.length > 1 || /[,.]/.test(token)
  );

  // Reconstruct the preprocessed text
  const preprocessedText = filteredTokens.join(" ");

  return preprocessedText;
};

const browse = async (url, question) => {
  const html = await fetchContent(url);
  const text = extractText(html);
  const processedText = await preprocessText(text.trim());
  const splitText = processedText.split(/[.]/);
  return splitText;
};
module.exports = {
  browse,
};
