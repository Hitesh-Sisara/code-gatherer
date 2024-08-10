import * as vscode from "vscode";

export const MAX_CHARACTERS = 800000; // Approximately 800,000 characters

export const BINARY_FILE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".tiff",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".mp3",
  ".mp4",
  ".avi",
  ".mov",
  ".wav",
  ".ttf",
  ".otf",
  ".woff",
  ".woff2",
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".ico",
  ".svg",
];

export const SYSTEM_GENERATED_FILES = [
  ".DS_Store",
  "Thumbs.db",
  "desktop.ini",
  ".gitignore",
  ".gitattributes",
  ".gitmodules",
  ".vscode",
  ".idea",
  ".vs",
];

export const DEFAULT_IGNORE_PATTERNS = [
  "node_modules",
  ".git",
  ".next",
  "build",
  "dist",
  "out",
  "target",
  "vendor",
  "__pycache__",
  ".vscode",
  ".idea",
  "*.pyc",
  "*.pyo",
  "*.pyd",
  "*.class",
  "*.log",
  "*.sqlite",
  "*.swp",
  ".DS_Store",
  "Thumbs.db",
];

export const LANGUAGE_MAP: { [key: string]: string } = {
  // Web development
  ".html": "html",
  ".htm": "html",
  ".css": "css",
  ".scss": "scss",
  ".sass": "sass",
  ".less": "less",
  ".js": "javascript",
  ".jsx": "jsx",
  ".ts": "typescript",
  ".tsx": "tsx",
  ".json": "json",
  ".xml": "xml",
  ".svg": "svg",

  // Server-side languages
  ".php": "php",
  ".py": "python",
  ".rb": "ruby",
  ".java": "java",
  ".class": "java",
  ".cs": "csharp",
  ".go": "go",
  ".rs": "rust",
  ".scala": "scala",
  ".kt": "kotlin",
  ".kts": "kotlin",
  ".groovy": "groovy",
  ".gradle": "gradle",

  // Shell and scripting
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "zsh",
  ".fish": "fish",
  ".ps1": "powershell",
  ".bat": "batch",
  ".cmd": "batch",
  ".vbs": "vbscript",
  ".vb": "vb",
  ".pl": "perl",
  ".pm": "perl",
  ".t": "perl",
  ".lua": "lua",

  // Markup and config
  ".md": "markdown",
  ".markdown": "markdown",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".toml": "toml",
  ".ini": "ini",
  ".cfg": "ini",
  ".conf": "conf",
  ".properties": "properties",

  // C-family languages
  ".c": "c",
  ".h": "c",
  ".cpp": "cpp",
  ".hpp": "cpp",
  ".cc": "cpp",
  ".cxx": "cpp",
  ".m": "objectivec",
  ".mm": "objectivec",

  // Database
  ".sql": "sql",
  ".mysql": "sql",
  ".pgsql": "sql",
  ".plsql": "plsql",

  // Other programming languages
  ".hs": "haskell",
  ".lhs": "haskell",
  ".elm": "elm",
  ".clj": "clojure",
  ".cljs": "clojure",
  ".cljc": "clojure",
  ".erl": "erlang",
  ".ex": "elixir",
  ".exs": "elixir",
  ".eex": "elixir",
  ".r": "r",
  ".rmd": "rmd",
  ".jl": "julia",
  ".dart": "dart",
  ".f": "fortran",
  ".f90": "fortran",
  ".fs": "fsharp",
  ".fsx": "fsharp",
  ".pas": "pascal",
  ".d": "d",
  ".v": "v",
  ".nim": "nim",
  ".cr": "crystal",

  // Web assembly
  ".wat": "wat",
  ".wasm": "wasm",

  // Game development
  ".gd": "gdscript",
  ".as": "actionscript",

  // DevOps and infrastructure
  ".tf": "terraform",
  ".tfvars": "terraform",
  ".hcl": "hcl",
  ".dockerfile": "dockerfile",
  ".dockerignore": "dockerignore",
  ".vagrantfile": "ruby",
  ".jenkinsfile": "groovy",

  // Data serialization
  ".proto": "protobuf",
  ".thrift": "thrift",

  // Template engines
  ".ejs": "ejs",
  ".pug": "pug",
  ".hbs": "handlebars",
  ".mustache": "mustache",
  ".twig": "twig",
  ".liquid": "liquid",

  // Others
  ".graphql": "graphql",
  ".dot": "dot",
  ".tex": "latex",
  ".rst": "restructuredtext",
  ".asciidoc": "asciidoc",
  ".adoc": "asciidoc",

  // Mobile development
  ".swift": "swift",
};

export const SELECTED_ICON = new vscode.ThemeIcon(
  "check",
  new vscode.ThemeColor("charts.green")
);
