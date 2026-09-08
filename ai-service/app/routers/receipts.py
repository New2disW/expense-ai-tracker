import os
import json
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from groq import Groq
from ..auth import verify_jwt_token
from ..rate_limit import check_rate_limit
from ..schemas import ReceiptParseResponse

router = APIRouter()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text()
    except Exception as e:
        print(f"PDF extraction error: {e}")
    return text

def extract_text_from_image(file_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"Image OCR error: {e}")
        return ""

@router.post("/parse", response_model=ReceiptParseResponse)
async def parse_receipt(file: UploadFile = File(...), auth_data: dict = Depends(verify_jwt_token)):
    check_rate_limit(auth_data["user_id"])
    content = await file.read()
    
    # 5MB max file size
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 5MB.")
        
    filename = file.filename.lower()
    
    extracted_text = ""
    if filename.endswith(".pdf"):
        extracted_text = extract_text_from_pdf(content)
    elif filename.endswith((".png", ".jpg", ".jpeg")):
        extracted_text = extract_text_from_image(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, PNG, JPG, or JPEG.")
        
    if not extracted_text.strip():
        # Empty extraction, return empty response for graceful degradation
        return ReceiptParseResponse()
        
    # Send extracted text to LLM
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    prompt = f"""You are a smart receipt parser. Extract the following from the raw receipt text.
    Return ONLY a raw JSON object with no markdown wrappers or other text.
    If you have low confidence in any field or it is missing, leave the field value as null or an empty string.

    Fields to extract:
    - amount: (number, the total cost. do not include currency symbols)
    - description: (string, the merchant name or brief summary of the items)
    - category: (string, MUST be one of these: food_dining, transportation, shopping, entertainment, utilities, healthcare, education, travel, business, home_garden, personal_care, gifts_donations, subscriptions, other)
    - date: (string, formatted as YYYY-MM-DD if found)
    
    Raw Receipt Text:
    {extracted_text[:3000]} # Limit to avoid token overload
    """
    
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content
        parsed_data = json.loads(result_text)
        
        return ReceiptParseResponse(
            amount=float(parsed_data.get("amount")) if parsed_data.get("amount") else None,
            description=parsed_data.get("description"),
            category=parsed_data.get("category"),
            date=parsed_data.get("date")
        )
    except Exception as e:
        print(f"LLM Parsing error: {e}")
        # Return empty on failure so frontend degrades gracefully
        return ReceiptParseResponse()
