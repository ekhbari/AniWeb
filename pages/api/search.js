import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const query = req.query.query;
    const searchUrl = `https://animeblkom.net/?s=${encodeURIComponent(query)}`;

    const { data } = await axios.get(searchUrl);
    const $ = cheerio.load(data);

    const results = [];

    $(".anime-card").each((i, el) => {
      const title = $(el).find(".anime-title").text().trim();
      const url = $(el).find("a").attr("href");
      const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");

      if (title && url) {
        results.push({ title, url, image });
      }
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Scraping failed" });
  }
}
