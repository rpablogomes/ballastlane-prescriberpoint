from flask import jsonify
from flask.views import MethodView
from flask_smorest import Blueprint
from rag_llm_model.main import main 
import ast  

llm_blp = Blueprint("llm", __name__, url_prefix="/api/llm", description="LLM")

@llm_blp.route("/<symptons>")
class Register(MethodView):
    def get(self, symptons):
        result = main(symptons)

        if result == 'No data is available':
            return jsonify({"response": []}), 404
        else:

            try:
                threadedResult = ast.literal_eval(result)
            except (ValueError, SyntaxError) as e:  
                threadedResult = [item.strip().strip("'") for item in result.split(",")]

            # Return the cleaned result as a JSON response
            return jsonify({"response": threadedResult}), 200
