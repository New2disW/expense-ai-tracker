from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, expenses, receipts

app = FastAPI(title="Expense AI RAG Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Expense AI RAG Service is running"}

app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(receipts.router, prefix="/api/receipts", tags=["Receipts"])
