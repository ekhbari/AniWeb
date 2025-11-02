import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "query parameter missing" });

  try {
    // رابط البحث في AnimeBlkom
    const searchUrl = `https://animeblkom.net/?s=${encodeURIComponent(query)}`;

    // جلب الصفحة مع User-Agent لتجنب الحظر
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8'
      },
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const results = [];

    $(".anime-card").each((_, el) => {
      const title = $(el).find(".anime-title").text().trim();
      const url = $(el).find("a").attr("href");
      const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
      if (title && url) {
        results.push({ title, url, image });
      }
    });

    if (results.length === 0) {
      return res.status(200).json({ message: "لا توجد نتائج أو تغير هيكل الموقع" });
    }

    return res.status(200).json(results);

  } catch (err) {
    return res.status(500).json({ error: "فشل جلب البيانات", details: err.message });
  }
}
