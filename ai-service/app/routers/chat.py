from fastapi import APIRouter, Depends
from ..schemas import QueryRequest, QueryResponse, ReceiptParseResponse
from pydantic import BaseModel
from ..rag_pipeline import ask_expenses
from ..auth import verify_jwt_token
from ..rate_limit import check_rate_limit
from ..cache import get_cached_response, set_cached_response
from groq import Groq
import os
import json

router = APIRouter()

class NLParseRequest(BaseModel):
    text: str

@router.post("/query", response_model=QueryResponse)
def query_expenses(req: QueryRequest, auth_data: dict = Depends(verify_jwt_token)):
    check_rate_limit(auth_data["user_id"])
    return ask_expenses(auth_data["user_id"], auth_data["token"], req.question)

@router.post("/parse-nl", response_model=ReceiptParseResponse)
def parse_natural_language(req: NLParseRequest, auth_data: dict = Depends(verify_jwt_token)):
    check_rate_limit(auth_data["user_id"])
    
    prompt = f"""You are an expense parser. Extract the following from the natural language text.
    Return ONLY a raw JSON object with no markdown wrappers or other text.
    If you have low confidence in any field or it is missing, leave the field value as null or an empty string.

    Fields to extract:
    - amount: (number, the total cost. do not include currency symbols)
    - description: (string, brief summary of the items)
    - category: (string, MUST be one of these: food_dining, transportation, shopping, entertainment, utilities, healthcare, education, travel, business, home_garden, personal_care, gifts_donations, subscriptions, other)
    - date: (string, formatted as YYYY-MM-DD if found, otherwise null)
    
    Natural Language Text:
    {req.text}
    """
    
    cached = get_cached_response(prompt)
    if cached:
        parsed_data = json.loads(cached)
        return ReceiptParseResponse(
            amount=float(parsed_data.get("amount")) if parsed_data.get("amount") else None,
            description=parsed_data.get("description"),
            category=parsed_data.get("category"),
            date=parsed_data.get("date")
        )

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        result_content = response.choices[0].message.content
        set_cached_response(prompt, result_content)
        parsed_data = json.loads(result_content)
        
        return ReceiptParseResponse(
            amount=float(parsed_data.get("amount")) if parsed_data.get("amount") else None,
            description=parsed_data.get("description"),
            category=parsed_data.get("category"),
            date=parsed_data.get("date")
        )
    except Exception as e:
        print(f"NL Parsing error: {e}")
        return ReceiptParseResponse()
