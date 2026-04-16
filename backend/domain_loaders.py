import uuid
from qdrant_client import models
from qdrant_db import client
from life_graph import embed

def seed_domain_knowledge():
    mock_chunks = [
        # Healthcare
        {"domain": "healthcare", "title": "PMJAY Overview", "content": "Pradhan Mantri Jan Arogya Yojana gives 5 lakh health insurance per family per year for secondary and tertiary care hospitalization in empaneled hospitals.", "language": "en", "source": "pmjay.gov.in"},
        {"domain": "healthcare", "title": "PMJAY Overview Hindi", "content": "प्रधानमंत्री जन आरोग्य योजना (PMJAY) के तहत हर परिवार को अस्पताल में भर्ती होने पर 5 लाख रुपये तक का मुफ्त इलाज मिलता है।", "language": "hi", "source": "pmjay.gov.in"},
        # Finance
        {"domain": "finance", "title": "PM-KISAN", "content": "PM-KISAN scheme provides income support of 6000 rupees per year in 3 equal installments to all land holding farmer families.", "language": "en", "source": "pmkisan.gov.in"},
        {"domain": "finance", "title": "PM-KISAN Hindi", "content": "पीएम किसान सम्मान निधि योजना के तहत छोटे और सीमांत किसानों को साल में 6000 रुपये की आर्थिक सहायता दी जाती है।", "language": "hi", "source": "pmkisan.gov.in"},
        # Government
        {"domain": "government", "title": "Aadhaar Card Update", "content": "To link your mobile number with Aadhaar, you need to visit the nearest Aadhaar enrolment centre. It cannot be done online.", "language": "en", "source": "uidai.gov.in"},
        # Education
        {"domain": "education", "title": "Diksha Portal", "content": "DIKSHA is a national platform for school education offering interactive learning material for teachers and students.", "language": "en", "source": "diksha.gov.in"},
    ]

    for chunk in mock_chunks:
        import asyncio
        vector = asyncio.run(embed(chunk["title"] + " " + chunk["content"]))
        chunk["chunk_id"] = str(uuid.uuid4())
        
        client.upsert(
            collection_name='domain_knowledge',
            points=[
                models.PointStruct(
                    id=chunk["chunk_id"],
                    vector=vector,
                    payload=chunk
                )
            ]
        )
    print("Seed domain knowledge completed.")

if __name__ == "__main__":
    seed_domain_knowledge()
