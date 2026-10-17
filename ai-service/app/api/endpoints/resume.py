from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.resume import ResumeParseResponse
from app.services.parser_service import parse_resume_content

router = APIRouter()

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit

@router.post("/parse", response_model=ResumeParseResponse, tags=["Resume"])
async def parse_resume_file(file: UploadFile = File(...)):
    filename = file.filename or "unknown"
    lower_name = filename.lower()
    if not (lower_name.endswith(".pdf") or lower_name.endswith(".docx") or lower_name.endswith(".doc")):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only PDF (.pdf) and Word (.docx) files are supported."
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB."
        )

    result = parse_resume_content(content, filename)
    return result
