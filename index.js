const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Vercel rewrite sends requests through /api/index/<original-path>.
app.use((req, res, next) => {
  const prefix = "/api/index";
  if (req.url === prefix || req.url.startsWith(prefix + "?")) {
    req.url = "/" + req.url.slice(prefix.length).replace(/^\\?/, "?");
  } else if (req.url.startsWith(prefix + "/")) {
    req.url = req.url.slice(prefix.length);
  }
  next();
});

const API_KEY = process.env.API_KEY || "TITAN";
const UPSTREAM_API_KEY = process.env.UPSTREAM_API_KEY || "ftgamer";
const UPSTREAM_API_URL =
  process.env.UPSTREAM_API_URL ||
  "https://broad-dust-ad2f.mohammadumar7221.workers.dev/api/tg";

app.get("/", (req, res) => {
  res.json({ status: "STY Proxy Running", by: "@g0zok" });
});

app.get("/tg", async (req, res) => {
  try {
    const key = req.query.key;
    const search = req.query.info || req.query.id;

    if (!key) {
      return res.status(400).json({ success: false, error: "key required" });
    }
    if (key !== API_KEY) {
      return res.status(401).json({ success: false, error: "Invalid API key" });
    }
    if (!search) {
      return res.status(400).json({ success: false, error: "info required" });
    }

    const response = await axios.get(UPSTREAM_API_URL, {
      params: { key: UPSTREAM_API_KEY, info: search },
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 30000
    });

    let data = response.data;

    if (typeof data === "string") {
      data = data.replace(/@draxionnn/gi, "@sahilxalone");
    } else if (data && typeof data === "object") {
      const replaceAttribution = (value) => {
        if (typeof value === "string") {
          return value.replace(/@draxionnn/gi, "@sahilxalone");
        }
        if (Array.isArray(value)) return value.map(replaceAttribution);
        if (value && typeof value === "object") {
          return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, replaceAttribution(v)])
          );
        }
        return value;
      };

      data = replaceAttribution(data);
      if (!Array.isArray(data)) data.by = "@g0zok";
    }

    return res.json(data);
  } catch (err) {
    return res.status(err.response?.status || 502).json({
      success: false,
      error: err.message || "Upstream request failed"
    });
  }
});

module.exports = app;
