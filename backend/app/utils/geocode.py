import requests
from fastapi import HTTPException, status
from dotenv import load_dotenv
from app.schemas.user import (
    PlaceDetails,
    AutocompleteResponse,
    AutocompleteResult,
    StructuredFormatting,
    ReverseGeocodingResponse,
    ReverseGeocodingResult
)
from typing import Dict, Any, Optional
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

async def reverse_geocoding(lat: float, lng: float) -> ReverseGeocodingResponse:
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "latlng": f"{lat},{lng}",
        "key": GOOGLE_API_KEY,
        "language": "en",
        "result_type": "street_address|route",
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Google Geocoding API error: {e}"
        )
    if data.get("status") != "OK":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Geocoding failed: {data.get('status')} - {data.get('error_message', '')}"
        )
    results = []
    for result in data.get("results", []):
        # Extract address components
        comp_dict: Dict[str, Any] = {
            comp["types"][0]: comp["long_name"]
            for comp in result.get("address_components", [])
        }

        # Helper to safely get component
        def get_comp(*types):
            for t in types:
                if val := comp_dict.get(t):
                    return val
            return None

        structured = ReverseGeocodingResult(
            formatted_address=result.get("formatted_address", ""),
            place_id=result.get("place_id"),
            lat=lat,
            lng=lng,
            street_number=get_comp("street_number"),
            route=get_comp("route", "neighborhood", "sublocality_level_3"),
            sublocality=(
                get_comp("sublocality", "sublocality_level_1", "neighborhood")
            ),
            city=(
                get_comp("locality")
                or get_comp("postal_town")
                or get_comp("administrative_area_level_2")
                or get_comp("administrative_area_level_3")
            ),
            district=(
                get_comp("administrative_area_level_3")
                or get_comp("administrative_area_level_2")
            ),
            state=get_comp("administrative_area_level_1"),
            country=get_comp("country"),
            country_code=get_comp("country", "country_code"),  # sometimes short_name
            postal_code=get_comp("postal_code"),
        )

        results.append(structured)

    return ReverseGeocodingResponse(
        results=results,
        status=data["status"]
    )