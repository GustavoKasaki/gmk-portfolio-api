export const languageIconMap = {
  JavaScript: "devicon-javascript-plain colored",
  TypeScript: "devicon-typescript-plain colored",
  HTML: "devicon-html5-plain colored",
  CSS: "devicon-css3-plain colored",
  SCSS: "devicon-sass-original colored",
  Vue: "devicon-vuejs-plain colored",
  Python: "devicon-python-plain colored",
  C: "devicon-c-plain colored",
  Cpp: "devicon-cplusplus-plain colored",
  Java: "devicon-java-plain colored",
  PHP: "devicon-php-plain colored",
  Ruby: "devicon-ruby-plain colored",
  Go: "devicon-go-original colored",
  Rust: "devicon-rust-plain colored",
  Shell: "devicon-bash-plain colored",
  Docker: "devicon-docker-plain colored",
  MySQL: "devicon-mysql-plain colored",
  PostgreSQL: "devicon-postgresql-plain colored",
  MongoDB: "devicon-mongodb-plain colored",
};

export const frameworkIconMap = {
  react: "devicon-react-original colored",
  next: "devicon-nextjs-plain colored",
  nuxt: "devicon-nuxtjs-plain colored",
  vite: "devicon-vitejs-plain colored",
  webpack: "devicon-webpack-plain colored",
  pinia: "devicon-vuejs-plain colored",
  redux: "devicon-redux-original colored",
  zustand: "devicon-react-original colored",
  tailwindcss: "devicon-tailwindcss-plain colored",
  bootstrap: "devicon-bootstrap-plain colored",
  sass: "devicon-sass-original colored",
  axios: "devicon-axios-plain colored",
  firebase: "devicon-firebase-plain colored",
  supabase: "devicon-supabase-plain colored",
  recharts: "devicon-react-original colored",
  d3: "devicon-d3js-plain colored",
};

const relevantPackages = [
  "react",
  "next",
  "nuxt",
  "vite",
  "webpack",
  "pinia",
  "redux",
  "zustand",
  "tailwindcss",
  "bootstrap",
  "bulma",
  "axios",
  "firebase",
  "supabase",
  "recharts",
  "d3",
];

export const filterRelevantDependencies = (deps) => {
  return deps
    .map((dep) => dep.toLowerCase())
    .filter((dep) => relevantPackages.includes(dep));
};
