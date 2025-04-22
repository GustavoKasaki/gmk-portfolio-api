import {
  languageIconMap,
  frameworkIconMap,
  filterRelevantDependencies,
} from "../utils/iconMap.js";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = "GustavoKasaki";

const query = `
{
  user(login: "${GITHUB_USERNAME}") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          id
          name
          description
          url
          homepageUrl
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
}`;

const fetchGraphQL = async () => {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  return json.data.user.pinnedItems.nodes;
};

const getDefaultBranch = async (repoName) => {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    }
  );

  const json = await res.json();
  return json.default_branch || "main";
};

const fetchDependencies = async (repoName, branch) => {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/contents/package.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );

    const json = await res.json();
    const content = Buffer.from(json.content, "base64").toString("utf-8");
    const packageJson = JSON.parse(content);

    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    const allDeps = [...dependencies, ...devDependencies];
    return filterRelevantDependencies(allDeps);
  } catch (err) {
    return [];
  }
};

const allowedOrigins = [
  "https://gmk-portfolio.vercel.app",
  "http://localhost:5173",
];

// Serverless function
export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: "GITHUB_TOKEN not defined" });
  }

  try {
    const repos = await fetchGraphQL();

    const result = await Promise.all(
      repos.map(async (repo) => {
        const branch = await getDefaultBranch(repo.name);
        const frameworks = await fetchDependencies(repo.name, branch);

        return {
          ...repo,
          previewImage: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${branch}/preview.png`,
          languages: repo.languages.nodes.map((lang) => ({
            name: lang.name,
            icon: languageIconMap[lang.name] || "devicon-devicon-plain",
          })),
          frameworks: frameworks.map((name) => ({
            name,
            icon: frameworkIconMap[name] || "devicon-devicon-plain",
          })),
        };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
}
