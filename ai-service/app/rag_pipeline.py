import os
import requests
from groq import Groq
from .embeddings import get_embedding, format_expense_text
from .vector_store import search_expenses, upsert_expense
from .schemas import SourceExpense, QueryResponse

SERVER_API_URL = os.getenv("SERVER_API_URL", "http://localhost:5000/api")

def rebuild_index_from_server(user_id: str, token: str):
    """Fetches all expenses for the user and rebuilds the FAISS index if missing or stale."""
    try:
        response = requests.get(
            f"{SERVER_API_URL}/expenses", 
            headers={"Authorization": f"Bearer {token}"},
            params={"limit": 1000} # Get a large batch for rebuild
        )
        if response.status_code == 200:
            expenses = response.json().get("expenses", [])
            for exp in expenses:
                expense_dict = {
                    "amount": exp.get("amount", 0),
                    "description": exp.get("description", ""),
                    "category": exp.get("category", ""),
                    "date": exp.get("date", "")
                }
                text = format_expense_text(expense_dict)
                embedding = get_embedding(text)
                metadata = {
                    "id": exp["_id"],
                    **expense_dict
                }
                upsert_expense(user_id, exp["_id"], embedding, metadata)
    except Exception as e:
        print(f"Failed to rebuild index: {e}")

def ask_expenses(user_id: str, token: str, question: str) -> QueryResponse:
    # 1. Embed question
    query_embedding = get_embedding(question)
    
    # 2. Retrieve from FAISS
    retrieved = search_expenses(user_id, query_embedding, top_k=10)
    
    # If nothing retrieved, maybe index is missing, let's try rebuilding once
    if not retrieved:
        rebuild_index_from_server(user_id, token)
        retrieved = search_expenses(user_id, query_embedding, top_k=10)
    
    if not retrieved:
        return QueryResponse(
            answer="I couldn't find any expenses matching your question. Try tracking some expenses first!",
            sources=[]
        )
        
    # 3. Format sources
    sources = []
    context_lines = []
    for exp in retrieved:
        sources.append(SourceExpense(
            id=exp['id'],
            amount=exp['amount'],
            description=exp['description'],
            category=exp['category'],
            date=exp['date']
        ))
        context_lines.append(f"- Date: {exp['date']} | Amount: ${exp['amount']} | Category: {exp['category']} | Desc: {exp['description']}")
        
    context_str = "\n".join(context_lines)
    
    # 4. Call LLM (Groq)
    from .cache import get_cached_response, set_cached_response
    
    prompt = f"""You are a helpful AI financial assistant. 
Answer the user's question based ONLY on the following retrieved expenses.
If the retrieved expenses do not contain the answer, explicitly state: "I don't have data on that." Do not guess or make up information.

Retrieved Expenses:
{context_str}

User Question: {question}
Answer:"""

    cached = get_cached_response(prompt)
    if cached:
        return QueryResponse(answer=cached, sources=sources)

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192",
        temperature=0.2,
    )
    
    answer_text = response.choices[0].message.content
    set_cached_response(prompt, answer_text)
    
    return QueryResponse(
        answer=answer_text,
        sources=sources
    )
