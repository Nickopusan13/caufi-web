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


def extract_components(result: dict) -> dict:
    comp = {}
    for c in result.get("address_components", []):
        for t in c["types"]:
            comp[t] = c["long_name"]
            if t == "country":
                comp["country_code"] = c["short_name"]
    return comp


async def get_place_details(place_id: str):
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "key": GOOGLE_API_KEY,
        "fields": "formatted_address,geometry,address_components,place_id",
        "language": "en",
    }
    res = requests.get(url, params=params, timeout=10).json()
    if res["status"] != "OK":
        raise HTTPException(
            status_code=400, detail=res.get("error_message", "Place not found")
        )
    r = res["result"]
    comp = extract_components(r)
    loc = r["geometry"]["location"]
    return PlaceDetails(
        lat=loc["lat"],
        lng=loc["lng"],
        place_id=place_id,
        formatted_address=r["formatted_address"],
        best_display_address=r["formatted_address"],
        street_number=comp.get("street_number"),
        route=comp.get("route"),
        street=f"{comp.get('street_number', '')} {comp.get('route', '')}".strip()
        or None,
        neighborhood=comp.get("neighborhood") or comp.get("sublocality_level_2"),
        sublocality=comp.get("sublocality") or comp.get("sublocality_level_1"),
        city=comp.get("locality")
        or comp.get("postal_town")
        or comp.get("administrative_area_level_2"),
        district=comp.get("administrative_area_level_3")
        or comp.get("administrative_area_level_2"),
        state=comp.get("administrative_area_level_1"),
        country=comp.get("country"),
        country_code=comp.get("country_code"),
        postal_code=comp.get("postal_code"),
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
