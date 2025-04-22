import requests
from bs4 import BeautifulSoup

def dailymedscrap(medicine):
    drugData = requests.get(f'https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name={medicine}')

    drugData = drugData.json()

    if not drugData["data"]:
        return {"status": 404, "message": "Drug not found"}

    drugId = drugData["data"][0]["setid"]

    html_response = requests.get(f'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid={drugId}')
    
    soup = BeautifulSoup(html_response.text, "html.parser")

    indicationTile = soup.find('a', string='1 INDICATIONS AND USAGE')

    parentsBasedOnTitle = indicationTile.find_parent('h1')

    indications = []
    for sibling in parentsBasedOnTitle.find_next_siblings():
        if sibling.name == 'h1':
            break
        if sibling.name == 'h2':
            disease = sibling.find('a')
            if disease:
                indications.append(disease.text.strip())

    threadedDiseases = [diseases.split('\t')[1] for diseases in indications]

    return {"status": 200, "data": str(threadedDiseases)}