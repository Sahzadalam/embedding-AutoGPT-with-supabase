const { browse } = require("../utils/browse");
const openAiHelper = require("../openAi");
const supabaseHelper = require("../supabase");
const google = async (query) => {
  const endpoint = `https://www.googleapis.com/customsearch/v1?key=AIzaSyDDAaG6b663jJEl36ctN4CKjfGzBLgQdAo&cx=628adb55e5d814342&q=${encodeURIComponent(
    query
  )}`;
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.items.map((item) => item.link);
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Command <google> failed: ${e.message}`);
    }

    throw new Error("Command <google> failed due to unknown reason");
  }
};
const storeEmbedding = async (req, res, databases) => {
  try {
    const { problemStatement } = req.body;
    console.log(problemStatement);
    const response = await google(problemStatement);
    for (let i = 0; i <= 0; i++) {
      const data = await browse(response[i], problemStatement);
      for (let j = 0; j <= data.length; j++) {
        const embedding = await openAiHelper.createEmbedding(data[j]);
        await supabaseHelper.from("semantic_search_poc_with_google").insert({
          content: data[j],
          embedding: embedding,
          content_url: response[i],
        });
      }
    }
    return res.json({
      success: true,
      data: response,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};
const searchEmbedding = async (req, res, databases) => {
  try {
    const { q } = req.query;
    const embedding = await openAiHelper.createEmbedding(q);
    const { data, error } = await supabaseHelper.rpc("semantic_search_new", {
      query_embedding: embedding,
      similiarity_threshold: 0.5,
      match_count: 10,
    });
    if (error) {
      return res.json({
        success: true,
        message: `${q} does not match any context`,
      });
    } else {
      return res.json({
        success: true,
        data: [...data],
      });
    }
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};
module.exports = {
  storeEmbedding,
  searchEmbedding,
};
