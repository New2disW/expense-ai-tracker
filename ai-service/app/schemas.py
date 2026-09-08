from pydantic import BaseModel
from typing import Optional, List

class ExpenseSync(BaseModel):
    expense_id: str
    user_id: str
    amount: float
    description: str
    category: str
    date: str
    action: str  # "upsert" or "delete"

class QueryRequest(BaseModel):
    question: str

class SourceExpense(BaseModel):
    id: str
    amount: float
    description: str
    category: str
    date: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceExpense]

class ReceiptParseResponse(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
