from fastapi import APIRouter, Depends
from ..schemas import ExpenseSync
from ..embeddings import get_embedding, format_expense_text
from ..vector_store import upsert_expense, delete_expense
from ..auth import verify_service_secret

router = APIRouter()

@router.post("/sync", dependencies=[Depends(verify_service_secret)])
def sync_expense(req: ExpenseSync):
    if req.action == "delete":
        delete_expense(req.user_id, req.expense_id)
        return {"status": "deleted"}
    else:
        # Generate embedding
        expense_dict = {
            "amount": req.amount,
            "description": req.description,
            "category": req.category,
            "date": req.date
        }
        text = format_expense_text(expense_dict)
        embedding = get_embedding(text)
        
        metadata = {
            "id": req.expense_id,
            "amount": req.amount,
            "description": req.description,
            "category": req.category,
            "date": req.date
        }
        upsert_expense(req.user_id, req.expense_id, embedding, metadata)
        return {"status": "upserted"}
