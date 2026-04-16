import os
from qdrant_client import QdrantClient, models
from dotenv import load_dotenv

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")

# Initialize client
client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY) if QDRANT_API_KEY else QdrantClient(url=QDRANT_URL)

def init_collections():
    for name, config in [
        ('life_events',     {'size': 1536, 'distance': models.Distance.COSINE}),
        ('user_profiles',   {'size': 1536, 'distance': models.Distance.COSINE}),
        ('domain_knowledge',{'size': 1536, 'distance': models.Distance.COSINE}),
        ('proactive_triggers',{'size': 1536, 'distance': models.Distance.COSINE}),
    ]:
        if not client.collection_exists(name):
            client.create_collection(name, vectors_config=models.VectorParams(**config))

if __name__ == "__main__":
    init_collections()
    print("Collections initialized successfully.")
