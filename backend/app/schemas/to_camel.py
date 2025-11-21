from pydantic import BaseModel, ConfigDict 
import re

def to_camel(string: str) -> str:
    parts = re.split("_+", string.strip("_"))
    return parts[0] + "".join(word.capitalize() for word in parts[1:])

class BaseConfigModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )