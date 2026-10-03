import os
import sys

# Resilient .env loader using standard library fallback if python-dotenv is not installed
def load_env_file(filepath=".env"):
    if not os.path.exists(filepath):
        return
    try:
        from dotenv import load_dotenv
        load_dotenv(filepath)
    except ImportError:
        # Pure Python fallback to parse .env without external dependencies
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                key = key.strip()
                val = val.strip().strip('"').strip("'")
                if key and key not in os.environ:
                    os.environ[key] = val

load_env_file(".env")

if __name__ == "__main__":
    try:
        import uvicorn
    except ImportError:
        print("\n[ERROR] Missing required dependencies. Please run:\n    pip install -r requirements.txt\n")
        sys.exit(1)

    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"\n=======================================================")
    print(f"✨ NovaSpark Backend Starting on http://localhost:{port}")
    print(f"📖 OpenAPI Swagger Docs: http://localhost:{port}/docs")
    print(f"=======================================================\n")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
