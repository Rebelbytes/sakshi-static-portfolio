const featuredProjects = [
  {
    slug: "saferide",
    name: "SafeRide",
    repo: "AISAFERIDE",
    type: "Computer vision / Road safety",
    description: "An AI-powered road-safety system using computer vision to support real-time traffic monitoring and automated violation reporting.",
    problem: "Manual traffic monitoring makes it difficult to identify and document violations consistently.",
    flow: "Video input → object detection → ANPR → violation record",
    stack: ["Python", "YOLOv8", "PyTorch", "OpenCV", "OCR", "Django REST", "React", "MySQL"],
    artwork: "SAFE\nRIDE",
    code: "CV / 001\nANPR SYSTEM",
  },
  {
    slug: "eatfit",
    name: "EatFit",
    repo: "EATFIT",
    type: "Applied ML / Food intelligence",
    description: "A smart packaged-food compatibility checker that reads product labels, evaluates health signals, and suggests better-fit alternatives.",
    problem: "Nutrition information is dense and difficult to translate into a quick, personal product choice.",
    flow: "Food label → OCR → product score → tailored alternatives",
    stack: ["Python", "OCR", "OpenCV", "Flask", "Scikit-learn", "MySQL"],
    artwork: "EAT\nFIT",
    code: "ML / 002\nLABEL SIGNAL",
  },
  {
    slug: "realtime-ai-backend",
    name: "Realtime AI Backend",
    repo: "TECNVIRONS-PRIVATE-LIMITED-ASSIGNMENT",
    type: "Backend systems / Real-time AI",
    description: "An asynchronous AI backend built around WebSockets, Supabase session storage, and post-conversation summaries.",
    problem: "Conversational systems need responsive message delivery while keeping session state and follow-up summaries organized.",
    flow: "WebSocket → FastAPI → session store → AI summary",
    stack: ["Python", "FastAPI", "WebSockets", "Supabase", "LLM"],
    artwork: "REAL\nTIME",
    code: "API / 003\nASYNC SYSTEM",
  },
  {
    slug: "stockmarket",
    name: "Stock Market Data Pipeline",
    repo: "stockmarket",
    type: "Data engineering / Streaming",
    description: "A modular pipeline for ingesting, streaming, storing, and analyzing live stock-market data with Kafka and AWS services.",
    problem: "Market data needs a reliable path from live ingestion to durable storage and analysis.",
    flow: "Market feed → Kafka → AWS services → analytics",
    stack: ["Python", "Apache Kafka", "AWS", "Data pipelines"],
    artwork: "MARKET\nFLOW",
    code: "DATA / 004\nSTREAM PIPELINE",
  },
  {
    slug: "spotifybi",
    name: "SpotifyBI",
    repo: "SpotifyBI",
    type: "Analytics / Business intelligence",
    description: "An interactive Power BI analytics project exploring listening behavior across time, artists, albums, tracks, and engagement.",
    problem: "Listening history becomes more useful when raw activity is shaped into clear trends and comparable metrics.",
    flow: "Listening data → model → DAX metrics → dashboard",
    stack: ["Power BI", "DAX", "Data modeling", "Analytics"],
    artwork: "LISTEN\nCLOSER",
    code: "BI / 005\nDAX ANALYTICS",
  },
];

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  response.setHeader("Cache-Control", "no-store");

  try {
    const githubResponse = await fetch("https://api.github.com/users/Rebelbytes/repos?per_page=100&type=public", {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "sakshi-kadam-portfolio",
      },
      signal: controller.signal,
    });

    if (!githubResponse.ok) {
      throw new Error(`GitHub returned ${githubResponse.status}`);
    }

    const repositories = await githubResponse.json();
    const repositoriesByName = new Map(repositories.map((repository) => [repository.name.toLowerCase(), repository]));
    const projects = featuredProjects.map((project) => {
      const repository = repositoriesByName.get(project.repo.toLowerCase());
      if (!repository || repository.private) {
        throw new Error(`Featured repository "${project.repo}" was not found in the public GitHub account`);
      }

      return {
        ...project,
        url: repository.html_url,
        language: repository.language || "Multiple technologies",
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        updatedAt: repository.pushed_at || repository.updated_at,
      };
    });

    response.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
    return response.status(200).json({ source: "github", username: "Rebelbytes", projects });
  } catch (error) {
    console.error("Unable to load featured GitHub repositories:", error);
    return response.status(502).json({ error: "Featured GitHub repositories could not be loaded" });
  } finally {
    clearTimeout(timeout);
  }
};
