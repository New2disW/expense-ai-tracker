from fastembed import TextEmbedding

# Load model globally to avoid reloading
model = TextEmbedding('sentence-transformers/all-MiniLM-L6-v2')

def get_embedding(text: str) -> list[float]:
    """Generates a dense vector embedding for the given text."""
    embedding = list(model.embed([text]))[0]
    return embedding.tolist()

def format_expense_text(expense_data: dict) -> str:
    """Formats expense data into a descriptive sentence for embedding."""
    return f"Spent ${expense_data['amount']} on {expense_data['description']} in category {expense_data['category']} on {expense_data['date']}."
