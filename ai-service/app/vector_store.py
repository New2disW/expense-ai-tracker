import os
import faiss
import json
import numpy as np

DATA_DIR = os.getenv("FAISS_INDEX_PATH", "./data/faiss_index")
os.makedirs(DATA_DIR, exist_ok=True)

VECTOR_DIMENSION = 384  # Dimension for all-MiniLM-L6-v2

def _get_index_path(user_id: str) -> str:
    return os.path.join(DATA_DIR, f"faiss_{user_id}.bin")

def _get_meta_path(user_id: str) -> str:
    return os.path.join(DATA_DIR, f"meta_{user_id}.json")

def _load_index_and_meta(user_id: str):
    index_path = _get_index_path(user_id)
    meta_path = _get_meta_path(user_id)
    
    if os.path.exists(index_path) and os.path.exists(meta_path):
        index = faiss.read_index(index_path)
        with open(meta_path, 'r') as f:
            meta = json.load(f)
    else:
        index = faiss.IndexFlatL2(VECTOR_DIMENSION)
        meta = {}
    return index, meta

def _save_index_and_meta(user_id: str, index, meta):
    faiss.write_index(index, _get_index_path(user_id))
    with open(_get_meta_path(user_id), 'w') as f:
        json.dump(meta, f)

def upsert_expense(user_id: str, expense_id: str, embedding: list[float], metadata: dict):
    index, meta = _load_index_and_meta(user_id)
    
    # Simple strategy for upsert in IndexFlatL2 without ID map:
    # 1. If exists, we rebuild index from scratch (since FAISS flat index doesn't support direct deletion easily)
    # Alternatively, use IndexIDMap
    
    # Convert to IndexIDMap to support remove
    if not isinstance(index, faiss.IndexIDMap):
        flat_index = faiss.IndexFlatL2(VECTOR_DIMENSION)
        index = faiss.IndexIDMap(flat_index)
        
        # If there were old items in the meta, rebuild them
        if meta:
            vectors = []
            ids = []
            for m_id, m_data in meta.items():
                vectors.append(m_data['embedding'])
                ids.append(int(m_id, 16) % (10**8)) # naive hash for id
            if vectors:
                index.add_with_ids(np.array(vectors, dtype=np.float32), np.array(ids, dtype=np.int64))

    # Remove old if exists
    faiss_id = hash(expense_id) % (10**8)
    try:
        index.remove_ids(np.array([faiss_id], dtype=np.int64))
    except:
        pass
        
    # Add new
    vector = np.array([embedding], dtype=np.float32)
    index.add_with_ids(vector, np.array([faiss_id], dtype=np.int64))
    
    metadata['embedding'] = embedding
    meta[expense_id] = metadata
    
    _save_index_and_meta(user_id, index, meta)

def delete_expense(user_id: str, expense_id: str):
    index, meta = _load_index_and_meta(user_id)
    
    if expense_id in meta:
        if isinstance(index, faiss.IndexIDMap):
            faiss_id = hash(expense_id) % (10**8)
            try:
                index.remove_ids(np.array([faiss_id], dtype=np.int64))
            except:
                pass
        del meta[expense_id]
        _save_index_and_meta(user_id, index, meta)

def search_expenses(user_id: str, query_embedding: list[float], top_k: int = 5) -> list[dict]:
    index, meta = _load_index_and_meta(user_id)
    
    if index.ntotal == 0:
        return []
        
    vector = np.array([query_embedding], dtype=np.float32)
    distances, indices = index.search(vector, min(top_k, index.ntotal))
    
    results = []
    # Reverse lookup from faiss_id to expense_id
    faiss_id_to_exp_id = { (hash(exp_id) % (10**8)): exp_id for exp_id in meta.keys() }
    
    for i, dist in zip(indices[0], distances[0]):
        if i != -1 and i in faiss_id_to_exp_id:
            exp_id = faiss_id_to_exp_id[i]
            results.append(meta[exp_id])
            
    return results
