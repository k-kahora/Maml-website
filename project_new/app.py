from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import subprocess

class Code(BaseModel):
    input: str


# Enable CORS

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)
# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/ocaml")
async def run_ocaml_job(input_data: Code):
    try:
        # Construct the Docker run command
        result = subprocess.run(
            ["docker", "run", "maml-image:latest", "-e",  input_data.input],
            capture_output=True,
            text=True,
            check=True
        )
        # Process the output from the OCaml executable
        output = result.stdout.strip()
        return {"result": output}

    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Job failed: {e.stderr}")

@app.get("/")
def index():
    return FileResponse("templates/index.html")


@app.post("/submit-text")
async def submit_text(input_text: str = Form(...)):
    return JSONResponse(content={"message": f"You sent: {input_text}"})


@app.get("/things")
async def read():
    return {"hello":"panckace"}

@app.post("/process-code")
async def post_code(code: Code):
    input = code.input
    output = input[::-1]
    return {"output": output}

