from typing import List, Dict


def snakeToCamel(snake_str: str) -> str:
    """Convert a snake_case string to camelCase."""
    parts = snake_str.split("_")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])


def convertListKeyToCamel(data: List[Dict]) -> List[Dict]:
    """
    Convert a list of snake_case key dictionaries to camelCase key dictionaries
    """
    result = []
    for d in data:
        converted_dict = convertDictKeyToCamel(d)
        result.append(converted_dict)
    return result


def convertDictKeyToCamel(data: Dict) -> Dict:
    """
    Convert a snake_case key dictionary to a camelCase key dictionary
    """
    result = {}
    for key, value in data.items():
        result[snakeToCamel(key)] = value
    return result
