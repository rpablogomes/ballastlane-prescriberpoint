from flask import jsonify
from flask.views import MethodView
from flask_smorest import Blueprint
from daily_med_scrapper.dailymed import dailymedscrap


scrapper_blp = Blueprint("drug", __name__, url_prefix="/api/scrapper/drug", description="Drug Information")

@scrapper_blp.route("/<drugName>")
class DrugInfo(MethodView):
    def get(self, drugName):
        """Endpoint that returns information about the drug (synonyms)"""
        
        response = dailymedscrap(drugName)
        
        return jsonify(response), 200
