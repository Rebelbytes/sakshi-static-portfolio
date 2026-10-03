const featuredProjects = [
  {
    slug: "saferide",
    name: "SafeRide",
    owner: "Rebelbytes",
    repo: "AISAFERIDE",
    type: "Computer vision / Road safety",
    description: "An AI-enabled traffic monitoring system that detects road-rule violations in live or uploaded footage, identifies vehicles, and supports digital challan workflows.",
    problem: "Manual traffic monitoring makes it difficult to identify and document violations consistently.",
    flow: "Live / CCTV video → YOLOv8 detection → number-plate recognition → e-challan",
    details: "Combines multi-violation detection, number-plate extraction, e-challan generation, and a dashboard for traffic analytics and historical challan records.",
    publication: {
      title: "SafeRide – AI Enabled Smart Traffic Violation Detection and Monitoring System Using Neural Vision",
      conference: "2nd IEEE International Conference on Computing, Communication and Green Engineering (CCGE 2026)",
      url: "https://ieeexplore.ieee.org/document/11581600",
      doi: "https://doi.org/10.1109/CCGE67142.2026.11581600",
    },
    stack: ["Python", "YOLOv8", "PyTorch", "OpenCV", "OCR", "Django REST", "React", "MySQL"],
  },
  {
    slug: "eatfit",
    name: "EatFit",
    owner: "Rebelbytes",
    repo: "EATFIT",
    type: "Applied ML / Food intelligence",
    description: "An AI food-health compatibility prototype that combines packaged-label analysis with a separate profile-based meal recommendation workflow.",
    problem: "Nutrition labels are hard to interpret quickly, while meal planning can benefit from a more guided starting point.",
    flow: "Label image → enhanced OCR → nutrient review → nutrition score",
    details: "The label flow extracts nutrition values for review and scoring; a separate Random Forest model recommends breakfast, lunch, and dinner using age, body measurements, and dietary-condition inputs.",
    stack: ["Python", "OCR", "OpenCV", "Flask", "Scikit-learn", "MySQL"],
  },
  {
    slug: "youtube-sentiment",
    name: "YouTube Sentiment Analyzer",
    owner: "TejasDeshmukh13",
    repo: "YouTube_Sentiment_Analyser_and_Title-Generator",
    type: "NLP / YouTube analytics",
    description: "Turns a YouTube URL into comment sentiment, title suggestions, transcript summaries, and channel statistics—giving creators a practical view of audience response and content.",
    problem: "Creators need a quick way to understand audience sentiment and turn video content into useful insights.",
    flow: "Video URL → comments and transcript → NLP → sentiment and title insights",
    details: "Includes positive / neutral / negative sentiment charts, T5-based title suggestions, transcript summaries, and channel view and subscriber statistics fetched through the YouTube Data API.",
    stack: ["Python", "Flask", "NLP", "Transformers", "YouTube Data API"],
  },
  {
    slug: "retailpro",
    name: "RetailPro",
    owner: "Rebelbytes",
    repo: "RetailPro",
    type: "Retail management / Desktop application",
    description: "Combines inventory and expense tracking with customer and supplier records, sales workflows, low-stock alerts, and profit-and-loss charts in a Python desktop app.",
    problem: "Small retailers often manage inventory and expenses with disconnected, manual tools.",
    flow: "Sales & expenses → inventory status → low-stock alerts → profit and loss",
    details: "Brings customer and supplier records, inventory updates, product-status views, sales tracking, and monthly financial visualizations together in a Tkinter application.",
    stack: ["Python", "Tkinter", "MySQL", "Matplotlib"],
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
    const projects = await Promise.all(featuredProjects.map(async (project) => {
      const githubResponse = await fetch(`https://api.github.com/repos/${encodeURIComponent(project.owner)}/${encodeURIComponent(project.repo)}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "sakshi-kadam-portfolio",
        },
        signal: controller.signal,
      });
      if (!githubResponse.ok) {
        throw new Error(`GitHub returned ${githubResponse.status} for ${project.owner}/${project.repo}`);
      }

      const repository = await githubResponse.json();
      if (repository.private) {
        throw new Error(`Featured repository "${project.owner}/${project.repo}" is private`);
      }

      return {
        ...project,
        url: repository.html_url,
        readmeUrl: `${repository.html_url}#readme`,
        language: repository.language || "Multiple technologies",
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        updatedAt: repository.pushed_at || repository.updated_at,
      };
    }));

    response.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
    return response.status(200).json({ source: "github", projects });
  } catch (error) {
    console.error("Unable to load featured GitHub repositories:", error);
    return response.status(502).json({ error: "Featured GitHub repositories could not be loaded" });
  } finally {
    clearTimeout(timeout);
  }
};
