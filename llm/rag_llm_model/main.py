from .groq_custom import GroqAPIConnect
from .embedding.generate_embbeding import Embedding
from .config.pinecone_ import PineconeClient

def main(symptons):

    embedding = Embedding()

    pc = PineconeClient()

    consult = f'return only a list of synonims the symptom {symptons} without any other information'


    embbdConsult = embedding.get_embedding(consult)
    
    aux = pc.search_embedding(embbdConsult,top_k=10)

    groq = GroqAPIConnect()

    content = groq.send_chat(
            chat=consult,
            db_content=aux
        )
    
    return content["choices"][0]["message"]["content"]
    
if __name__ == '__main__':
    main()








    