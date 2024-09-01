from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


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

@app.get("/")
def index():
    return FileResponse("templates/index.html")

@app.post("/submit-text")
async def submit_text(input_text: str = Form(...)):
    return JSONResponse(content={"message": f"You sent: {input_text}"})


@app.get("/things")
async def read():
    return {"hello":"world"}
