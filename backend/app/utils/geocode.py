import requests
from fastapi import HTTPException, status
from dotenv import load_dotenv
from app.schemas.user import (
    PlaceDetails,
    AutocompleteResponse,
    AutocompleteResult,
    StructuredFormatting,
)
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


async def get_place_details(place_id: str):
    url = (
        "https://maps.googleapis.com/maps/api/place/details/json"
        f"?place_id={place_id}&key={GOOGLE_API_KEY}"
    )
    res = requests.get(url).json()
    if res["status"] != "OK":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error fetching place details",
        )
    result = res["result"]
    location = result["geometry"]["location"]
    return PlaceDetails(
        lat=location.get("lat"),
        lng=location.get("lng"),
        formatted_address=result.get("formatted_address", ""),
        place_id=place_id,
    )


async def autocomplete_place(input: str) -> AutocompleteResponse:
    url = "https://maps.googleapis.com/maps/api/place/autocomplete/json"
    params = {
        "input": input,
        "key": GOOGLE_API_KEY,
        "types": "geocode",
        "language": "en",
    }
    try:
        res = requests.get(url, params=params, timeout=5)
        res.raise_for_status()
        data = res.json()
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Google API error: {e}"
        )
    if data.get("status") != "OK":
        return AutocompleteResponse(predictions=[])
    predictions = []
    for item in data.get("predictions", []):
        structured = StructuredFormatting(
            main_text=item["structured_formatting"]["main_text"],
            secondary_text=item["structured_formatting"].get("secondary_text", ""),
        )
        predictions.append(
            AutocompleteResult(
                place_id=item["place_id"],
                description=item["description"],
                structured_formatting=structured,
            )
        )
    return AutocompleteResponse(predictions=predictions)
